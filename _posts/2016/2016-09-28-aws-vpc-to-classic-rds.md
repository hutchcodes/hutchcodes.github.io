---
layout: post
title: Connection AWS VPC to Classic RDS
categories: [AWS]
date: 2016-09-28
published: true
---

A while back we did an audit of what we were spending through Amazon Web Services to see if there was any way we could reduce our spending without having a negative impact on our users. 

One of the big things we found we would be able to do was upgrade some of our production EC2 instances from for AWS's older m1.medium to an m3.medium, and our dev/test instances could downgrade from m1.small to t2.small.

The catch was we needed to create those instances in AWS's Virtual Private Network (VPC), and there is no documentation for how to connect that VPC to things running "Classic Mode". Our database was running on a RDS instance that was in Classic Mode and we didn't want to incur the downtime to move that to a VPC.

Here's how we eventually were able to get our VPC instance to talk to our classic mode RDS.

1. Create the VPC with a CIDR of 10.0.0.0/16. This also creates a single Route Table name that one ```Through NAT```   
2. Create second Route Table and call it ```Through IGW```
3. Create a ```Public``` Subnet with a CIDR of 10.0.0.0/24
4. From the Route Table tab of the Subnet click edit and select the ```Through IGW``` Route Table from the dropdown
5. Create a ```Private``` Subnet with a CIDR of 10.0.1.0/24
6. From the Route Table tab of the Subnet click edit and select the ```Through NAT``` Route Table from the dropdown
7. From the Subnet Association tab of the ```Through IGW``` Route Table click edit and select the ```Public``` Subnet.
8. From the Subnet Association tab of the ```Through NAT``` Route Table click edit and select the ```Private``` Subnet.
9. Create an Internet Gateway and make a note of it's ID
10. Select the Internet Gateway and click Attach to VPC to attach to your VPC
11. Edit the Routes of the ```Through IGW``` Route Table to add a route with 0.0.0.0/0 as the destination and the ID of the Internet Gateway as the target
12. Create a NAT Gateway, select the ```Private``` Subnet and create a new EIP
13. Edit the Routes of the ```Through NAT``` Route Table to add a route with 0.0.0.0/0 as the destination and the ID of the NAT Gateway as the target
14. Add the Elastic IP associated with the NAT Gateway to the allowed IP addresses in the Securit Groups section of the RDS dashboard
15. Cross your fingers

Connecting their two different styles of networks is something that I think should be built in to AWS's tools. Not only is it not worked in, but when I  contacted support about this they said it was impossible. I would have taken their word for it if we hadn't already had this running to allow a webserver in one datacenter to talk to RDS in another.

If this doesn't work, I'd be happy to try to help you figure it out and more importantly I'd like to update the steps so others don't strugle.
