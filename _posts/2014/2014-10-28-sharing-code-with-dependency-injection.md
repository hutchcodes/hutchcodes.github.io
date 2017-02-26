---
layout: post
categories: [C#, Mobile, XPlat]
title: Sharing Code with Dependency Injection
---
This is a multipart series on how to share code between .Net platforms.  All the examples will be showing how to share between Windows 8 Store applications and Windows Phone 8 application, but the techniques are useful for sharing code between any .Net/Xamarin platforms.
<ol>
	<li><a href="http://hutchcodes.net/linked-files/">Linked Files</a></li>
	<li><a href="http://hutchcodes.net/conditional-compilation/">Conditional Compilation</a></li>
	<li><a href="http://hutchcodes.net/partial-classes/">Partial Classes</a></li>
	<li><a href="http://hutchcodes.net/sharing-code-with-inheritance/">Inheritance</a></li>
	<li><a href="http://hutchcodes.net/sharing-code-with-dependency-injection/">Dependency Injection</a></li>
</ol>
<h3>What is Dependency Injection?</h3>
Dependency Injection is a form of inversion of control where the consumer of a service passes some of the objects on which that service is dependent to the service, rather than having the service create them.
<!--more-->

<h3>How do I do it?</h3>
In this case we’re not going to use a Dependency Injection framework, we’re going to use what I call “the poor mans dependency injection”.  I’m doing it this way to keep it simple and this could still work well with a framework.

First we’re going to create a Portable Class Library and in that library we’re going to define an interface for our data storage methods

~~~ csharp
public interface IMyStorage
{
    void Save(string key, object value);
    object Get(string key);
}
~~~

The we’re going to move our MainePageViewModel class to that library.  We need to modify that class to accept an IMyStorage in it’s constructor, then use that object to get and save it’s data.

~~~ csharp
public class MainPageViewModel : INotifyPropertyChanged
{
    private IMyStorage _myStorage;
    public MainPageViewModel(IMyStorage myStorage)
    {
        _myStorage = myStorage;
    }

    private string _helloMessage = "Hello World";
    public string HelloMessage
    {
        get { return _helloMessage; }
        set
        {
                
            if (_helloMessage != value)
            {
                _helloMessage = value;
                RaisePropertyChanged("HelloMessage");
            }
        }
    }

    private string _name = "";
    public string Name
    {
        get { return _name; }
        set
        {
            if (_name != value)
            {
                _name = value;
                RaisePropertyChanged("Name");
            }
        }
    }

    public ICommand SaveAction { get { return new RelayCommand(() =&gt; Save()); } }

    public ICommand LoadAction { get { return new RelayCommand(() =&gt; Load()); } }

    private void Load()
    {
        object name = null;

        name = _myStorage.Get("Name");

        if (name != null)
        {
            HelloMessage = "Load " + name.ToString();
        }
    }

    private void Save()
    {
        _myStorage.Save("Name", Name);

        HelloMessage = "Save " + Name;
    }

    private void RaisePropertyChanged(string propertyName)
    {
        if (PropertyChanged != null)
        {
            PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    public event PropertyChangedEventHandler PropertyChanged;
}
~~~

In the platform specific projects we need to add a reference to the PCL and create a class that implements IMyStorage. Windows Phone specific code below

~~~ csharp
class MyStorage : IMyStorage
{
    public void Save(string key, object value)
    {
        if (IsolatedStorageSettings.ApplicationSettings.Contains(key))
        {
            IsolatedStorageSettings.ApplicationSettings[key] = value;
        }
        else
        {
            IsolatedStorageSettings.ApplicationSettings.Add(key, value);
        }
    }

    public object Get(string key)
    {
        if (IsolatedStorageSettings.ApplicationSettings.Contains(key))
        {
            return IsolatedStorageSettings.ApplicationSettings[key];
        }
        return null;
    }
}
~~~

Then in the MainPage.xaml.cs where we are setting the page’s datacontext to the MainPageViewModel, we need to make sure we’re passing a new instance of the MyStorage class (this is the actual Dependency Injection, poor man’s style)

~~~ csharp
private void PhoneApplicationPage_Loaded(object sender, RoutedEventArgs e)
{
    this.DataContext = new MainPageViewModel(new MyStorage());
}
~~~

