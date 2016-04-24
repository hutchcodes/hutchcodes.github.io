---
layout: post
categories: [C#, Mobile]
title: Sharing Code with Inheritance
---
This is a multipart series on how to share code between .Net platforms.  All the examples will be showing how to share between Windows 8 Store applications and Windows Phone 8 application, but the techniques are useful for sharing code between any .Net/Xamarin platforms.
<ol>
	<li><a href="http://hutchcodes.net/linked-files/">Linked Files</a></li>
	<li><a href="http://hutchcodes.net/conditional-compilation/">Conditional Compilation</a></li>
	<li><a href="http://hutchcodes.net/partial-classes/">Partial Classes</a></li>
	<li><a href="http://hutchcodes.net/sharing-code-with-inheritance/">Inheritance</a></li>
	<li><a href="http://hutchcodes.net/sharing-code-with-dependency-injection/">Dependency Injection</a></li>
</ol>
<h3>What is Inheritance?</h3>
I’m just going to go ahead and assume you understand inheritance, but I’m keeping this section to stay with the theme from the other posts in this series.
<!--more-->

<h3>How do I do it?</h3>
To share code in this way we’re going to create an abstract class MainViewModelBase with an abstract method defined for the place where we’re going to do our platform specific coding.  We can share that class between projects either through file linking or creating a Portable Class Library

~~~ csharp
abstract class MainPageViewModelBase : INotifyPropertyChanged
{
    protected abstract void Load();
    protected abstract void Save();

    //The rest of the common code would go here
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

Then we’re going to inherit from that class in each of our projects.  Here’s what the code for the Windows Phone project looks like

~~~ csharp
class MainPageViewModel : MainPageViewModelBase
{
    protected override void Load()
    {
        object name = null;
        if (IsolatedStorageSettings.ApplicationSettings.Contains("Name"))
        {
            name = IsolatedStorageSettings.ApplicationSettings["Name"];
        }
        if (name != null)
        {
            HelloMessage = "Hello " + name.ToString();
        }
    }

    protected override void Save()
    {
        if (IsolatedStorageSettings.ApplicationSettings.Contains("Name"))
        {
            IsolatedStorageSettings.ApplicationSettings["Name"] = Name;
        }
        else
        {
            IsolatedStorageSettings.ApplicationSettings.Add("Name", Name);
        }
        HelloMessage = "Hello " + Name;
    }
}
~~~

