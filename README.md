# easyLPS
easyLPS is a novel workflow interface which can be translated to LPS.

It is currently deployed on azure, and you can get access to it directly [here](https://easylpsazure.azurewebsites.net).

## Deployment
* Download a [Eclipse Installer](https://www.eclipse.org/downloads/)
* Open Eclipse Installer and select Eclipse IDE for Java EE Developers to download
* Download [Apache Tomcat 8.5](https://tomcat.apache.org/download-80.cgi)
* Open Eclipse IDE for Java EE Developers and select File-New-New Dynamic Web Project
* Type in easyLPS as the project name, select 3.1 as the Dynamic web module version, and click on "New Runtime..."
* Select Apache-Apache Tomcat v8.5-Next
* Browse the Tomcat Installation Directory and click Finish, then click Finish to create the new web project
* Download WebContent and src folders in [github repository of easyLPS](https://github.com/luoxiao0123/easyLPS), and copy everything under these two folders to the newly created web project
* Download [json-lib Java library](https://sourceforge.net/projects/json-lib/files/) and its dependencies
  * [commons-lang 2.5](https://commons.apache.org/proper/commons-lang/)
  * [commons-beanutils 1.8.0](http://commons.apache.org/proper/commons-beanutils/)
  * [commons-collections 3.2.1](https://commons.apache.org/proper/commons-collections/)
  * [commons-logging 1.1.1](https://commons.apache.org/proper/commons-logging/)
  * [ezmorph 1.0.6](https://sourceforge.net/projects/ezmorph/files/)
* Right click the project, select Build Path-Configure Build Path
* Select Libraries-Classpath, and click Add External JARs to add the above six Java libraries
* Install a new server, and run the program successfully on http://localhost:8080/easyLPS/

## User Guide
User guide is available [here](https://github.com/luoxiao0123/easyLPS/blob/master/userguide.pdf)

## Notice
All files in folder /WebContent/js and /WebContent/css are the following javascript and CSS libraries. 
* jQuery 3.1.1
* jquery-ui 1.12.1
* lodash 3.10.1
* backbone 1.3.3
* jointjs 2.1.3
* Qunit 2.6.2
