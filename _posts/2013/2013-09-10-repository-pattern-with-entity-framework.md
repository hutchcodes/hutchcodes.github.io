---
layout: post
categories: [C#]
title: Repository Pattern with Entity Framework
---
I’m currently working on a little side project using ASP.Net MVC and Entity Framework, so of course my urls looks something like <a href="http://mysite.com/orders/14">http://mysite.com/orders/14</a> to pull up the order that has OrderId 14.&nbsp; The problem of course is security, I need to ensure that users can only view their own orders.
<!--more-->

My first pass at managing this was to just add the UserId to the where clause of a LINQ query.

~~~cs
dbContext.Orders.FirstOrDefault(x => x.Id == OrderId && x.UserId == userId);
~~~

This obviously works, but leaves me open making mistakes down the road by either forgetting to add that to the where clause, or on a more complex where clause having the UserId portion not working in one of the Or branches. &nbsp;My first thought was of course to add some unit tests to the controller actions to account for this, but when I thought about doing that I realized I would essentially be writing the same test for every action.

I decided I needed to move the responsibility for adding the UserId to the where clause to a central location that handled that for all calls to user specific entities. &nbsp;I could then write unit tests that code once and rest assured that all my controller actions were covered for that case.

My solution involved putting a generic repository layer on top of Entity Framework that was able to both.

First I defined the repository interface:

~~~cs
public interface IRepository<T>
{
    T GetById(int id);
    IQueryable<T> GetAll();
    void Add(T entity);
    void Update(T entity);
    void Delete(int id);
    void Delete(T entity);
}
~~~

And an interface that all user specific entities must implement

~~~cs
public interface IUserEntity
{
    int Id { get; set; } 
    int UserId { get; set; }
}
~~~

Then the repository itself with methods for all CRUD operations.&nbsp; You’ll notice that each operation checks to ensure that the UserId of the entity affected matches the UserId that was used to create the repository:

~~~cs
public class UserRepository<T> : IRepository<T> where T : class, IUserEntity
{
    private readonly int _userId;

    public UserRepository(DbContext dbContext, int userId)
    {
        _userId = userId;
        if (dbContext == null)
        {
            throw new ArgumentNullException("dbContext");
        }
        DbContext = dbContext;
        DbSet = DbContext.Set<T>();
    }

    protected DbContext DbContext { get; set; }

    protected DbSet<T> DbSet { get; set; }

    public virtual IQueryable<T> GetAll()
    {
        return DbSet.Where(x => x.UserId == _userId);
    }

    public virtual T GetById(int id)
    {
        var entity = DbSet.FirstOrDefault(x => x.Id == id && x.UserId == _userId);
        return entity;
    }

    public virtual void Add(T entity)
    {
        entity.UserId = _userId;
        DbEntityEntry dbEntityEntry = DbContext.Entry(entity);
        if (dbEntityEntry.State != EntityState.Detached)
        {
            dbEntityEntry.State = EntityState.Added;
        }
        else
        {
            DbSet.Add(entity);
        }
    }

    public virtual void Update(T entity)
    {
        if (entity.UserId != _userId)
        {
            return;
        }

        DbEntityEntry dbEntityEntry = DbContext.Entry(entity);
        if (dbEntityEntry.State == EntityState.Detached)
        {
            DbSet.Attach(entity);
        }
        dbEntityEntry.State = EntityState.Modified;
    }

    public virtual void Delete(T entity)
    {
        if (entity.UserId != _userId)
        {
            return;
        }

        DbEntityEntry dbEntityEntry = DbContext.Entry(entity);
        if (dbEntityEntry.State != EntityState.Deleted)
        {
            dbEntityEntry.State = EntityState.Deleted;
        }
        else
        {
            DbSet.Attach(entity);
            DbSet.Remove(entity);
        }
    }

    public virtual void Delete(int id)
    {
        var entity = GetById(id);
        if (entity == null) return; // not found; assume already deleted.

        if (entity.UserId != _userId)
        {
            return;
        }
        Delete(entity);
    }
}
~~~

Next we wrap all of those repositories up in a Unit of Work pattern, (sample code only shows one repository, my production code has all my repositories in one UOW class).

~~~cs
public class UoW : IDisposable
{
    private readonly int _userId;
    private MyDbContext DbContext { get; set; }

    public UoW(int userId)
    {
        _userId = userId;
        DbContext = new MyDbContext();
    }

    private IRepository<Order> _orders;
    public IRepository<Order> Orders
    {
        get
        {
            if (_orders == null)
            {
                _orders = new UserRepository<Order>(DbContext, _userId);
            }
            return _orders;
        }
    }

    public void Dispose()
    {
        if (DbContext != null)
        {
            DbContext.Dispose();
        }
    }
}
~~~

Now when we want all of the Order 14, we create an instance of the Unit Of Work class for the current user and request Order 14.

~~~cs
var uow = new UoW(123);
uow.Orders.GetById(14);
~~~

And if someone types `http://mysite.com/orders/14` into the address bar, they won’t get back any data if their UserId doesn’t match the UserId for Order 14.

It’s still not very testable, but all it takes is adding another constructor to allow us to pass in the DBContext:

~~~cs
public UoW(int userId, MyDbContext dbContext)
{
    _userId = userId;
    DbContext = dbContext;
}
~~~

Now we can use any DBContext we like for testing.&nbsp; I’m using <a href="https://www.nuget.org/packages/Effort/" target="_blank">Effort - Entity Framework Unit Testing Tool</a> to create an in memory database context for testing purposes.&nbsp; It’s fast and simple to use.

