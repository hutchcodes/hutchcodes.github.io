---
layout: post
categories: [WPF Xaml]
title: Using a different DataTemplate when a WPF ComboBox is expanded
---
A quick post showing how to create a combo box that shows a single line, shows multiple lines when expanded. Obviously you can extend this to show any two datatemplates for collapsed and expanded.

<img alt="ComboBoxExample" src="http://www.codeproject.com/KB/WPF/WPF_Combobox_Datatemplate/ComboExample.PNG" />
<!--more-->

The first thing I did was create the data templates that control how the address is going be displayed. When it’s collapsed, I just wanted to show the <em>AddressName</em> and <em>AddressType</em> on one line:

~~~ xml
<DataTemplate x:Key="AddressComboCollapsed" >
    <StackPanel Width="150" HorizontalAlignment="Stretch" >
        <DockPanel HorizontalAlignment="Stretch">
            <TextBlock Text="{Binding Path=AddressName}" 
                       DockPanel.Dock="Left" />
            <TextBlock Text="{Binding Path=AddressType}" 
                       DockPanel.Dock="Right"
                       HorizontalAlignment="Right" />
        </DockPanel>
    </StackPanel>
</DataTemplate>
~~~ 

When it’s expanded, I want to show the whole address and suppress AddressLine2 if it’s blank:
	
~~~ xml
<DataTemplatea x:Key="AddressComboExpanded" >
    <GroupBox BorderThickness = "1"
              Margin = "0,0,0,3"
              Width = "Auto "
              HorizontalAlignment = "Stretch"
              Header = "{Binding Path=AddressType}">
        <StackPanel Margin="3" 
                    HorizontalAlignment="Stretch"
                    MinWidth="250">
                <TextBlock Text = "{Binding Path=AddressName}"/>

            <TextBlock Text = "{Binding Path=AddressLine1}"
                       Name = "tbAddr1" />
            <TextBlock Text = "{Binding Path=AddressLine2}"
                       Name = "tbAddr2" />

            <!-- City, State, and ZIP display -->
            <StackPanel Orientation = "Horizontal">
                <TextBlock Text = "{Binding Path=City}" />
                <TextBlock Text="," Padding="0,0,5,0"/>
                <!-- Put a comma between city and state -->

                <TextBlock Text = "{Binding Path=State}" Padding="0,0,5,0" />
                <TextBlock Text = "{Binding Path=PostalCode}" />
            </StackPanel>
        </StackPanel>
    </GroupBox>

    <DataTemplate.Triggers>
        <!--If the "AddressLine2" portion of the address is blank, then
            HIDE it (no need to display an extra blank line)
            
            This only works is AddressLine2 = "", not if it's null
        -->
        <DataTrigger Binding = "{Binding Path=AddressLine2}" Value = "">
            <Setter TargetName = "tbAddr2" 
                    Property = "Visibility" 
                    Value = "Collapsed" />
        </DataTrigger>
    </DataTemplate.Triggers>
</DataTemplate>
~~~ 

The next step was to create a <em>AddressTemplateSelector</em> class that inherits from <em>System.Windows.Controls.DataTemplateSelector.DataTemplateSelector</em>, and override the <em>SelectTemplate</em> method.

~~~ cs
public class AddressTemplateSelector : System.Windows.Controls.DataTemplateSelector
{
    public override DataTemplate SelectTemplate(object item, DependencyObject container)
    {
        ContentPresenter presenter = (ContentPresenter)container;

        if (presenter.TemplatedParent is ComboBox)
        {
            return (DataTemplate)presenter.FindResource("AddressComboCollapsed");
        }
        else // Templated parent is ComboBoxItem
        {
            return (DataTemplate)presenter.FindResource("AddressComboExpanded");
        }
    }
}
~~~ 

After that, it’s just a matter of importing the namespace of the <code>DataTemplateSelector</code> into the Window, merging the Resource Dictionary that contains the DataTemplates, and setting the <em>ItemTemplateSelector</em> of the <em>ComboBox</em>.

~~~ xml
<ComboBox Height="30" Width="200"
            ItemsSource="{Binding Path=Addresses}">
    <ComboBox.ItemTemplateSelector>
        <dt:AddressTemplateSelector/>
    </ComboBox.ItemTemplateSelector>
</ComboBox>
~~~ 

<h4>Point of Interest</h4>
If you look closely at the templates, you’ll notice that the expanded template is wider than both the combobox and the collapsed template. This allows you to have the list be wider than the original combobox. That’ll be a nice feature when I move on to the state selection combo (display only StateCode, but show StateCode + StateName when expanded).
