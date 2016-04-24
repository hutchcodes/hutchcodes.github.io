---
layout: post
categories: [Sql]
title: Automating the compare of 2 rows in a trigger
---
I just answered this <a href="http://stackoverflow.com/questions/23500284/generic-solution-to-compare-2-rows/23500897#23500897" target="_blank">question</a> on StackOverflow about how to generically compare an inserted row to a deleted row within a trigger. I started by just commenting that it would be a good place to do a little code generation, but something about the problem wouldn't let me put it down. Here's what I came up with.
<!--more-->

First I created a function that would return the query that would actually do the comparison. Notice that I'm comparing <em>#inserted</em> and <em>#deleted</em> rather than <em>inserted</em> and <em>deleted</em>. &nbsp;This is because we don't have access to the <em>inserted</em> and <em>deleted</em> tables when we're running the comparison query in an <em>exec()</em>

~~~ sql
create function GetChangedRowsQuery(
	@TableName				varchar(50), 
	@PrimaryKeyColumnName	varchar(50),
	@RowVersionColumnName	varchar(50) = ''
)
returns varchar(max)
as
begin
	
    declare 
	@ColumnName varchar(50),
	@GetChangedRowsQuery varchar(max)

    select @GetChangedRowsQuery = 
           'select isnull(a.' + @PrimaryKeyColumnName + ', b.' 
           + @PrimaryKeyColumnName + ') 
      from #inserted a
      full join #deleted b 
        on a.' + @PrimaryKeyColumnName + ' 
           = b.' + @PrimaryKeyColumnName + '
     where '

    declare ColumnCursor cursor Read_Only
    for select Name
          from Sys.columns
         where object_id = Object_Id('Member')

    open ColumnCursor
    fetch next from ColumnCursor into @ColumnName
    while @@FETCH_STATUS = 0
      begin
	if (@ColumnName != @PrimaryKeyColumnName 
            and @ColumnName != @RowVersionColumnName)
	  begin
            select @GetChangedRowsQuery = @GetChangedRowsQuery 
                + '((a.' + @ColumnName + ' != b.' + @ColumnName 
                + ' or a.' + @ColumnName + ' is null 
                    or b.' + @ColumnName + ' is null) 
                and (a.' + @ColumnName + ' is not null 
                     or b.' + @ColumnName + ' is not null))' 
                + char(13) + '      or ' 
          end
        fetch next from ColumnCursor into @ColumnName
      end
    close ColumnCursor
    deallocate ColumnCursor

    select @GetChangedRowsQuery 
           = substring(@GetChangedRowsQuery, 0, len(@GetChangedRowsQuery) -7)

    return @GetChangedRowsQuery
end
~~~
Next, I created a trigger. &nbsp;It creates the <em>#inserted</em> and <em>#deleted</em>&nbsp;temp tables, get's the query from the function, creates a temp table to hold the results. &nbsp;Then it inserts the result into the temp table. &nbsp;I'm just selecting the <em>top 10</em>&nbsp;changed rows, but you could do whatever you needed to do with the changed rows at this point.

~~~sql
create trigger TestTrigger on Member for Insert, Update, Delete
as
begin
	
    select *
      into #Inserted
      from Inserted

    select *
      into #Deleted
      from Deleted

    declare @GetChangedRowsQuery varchar(max)

    select @GetChangedRowsQuery 
            = dbo.GetChangedRowsQuery('MemberTrash', 'MemberId', '')

    create table #Temp (PrimaryKey int)

    insert into #Temp (PrimaryKey)
    exec (@GetChangedRowsQuery) 

    select top 10 *
      from #Temp

    drop table #Temp
    drop table #Inserted
    drop table #Deleted
end
~~~

