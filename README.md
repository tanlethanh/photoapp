# CSC 317 Term Project

## Purpose
The purpose of the term project is to build a fully functional web application.

### Student Information

|               | Information   |
|:-------------:|:-------------:|
| Student Name  | Thanh Cong Duong     |
| Student ID    | 922438176       |
| Student Email | tduong7@sfsu.edu    |

# Setup Tutorial
## Database
We need both `mysql server` and `mysql workbench`. Using `workbench` to easily connect, migrate database.
- First, open `database.mwb` by `workbench`.
- Export `DDL` scripts from the schema file

![image](https://github.com/tanlethanh/photoapp/assets/104194494/0308ab71-5de2-4923-b754-3766a20d215a)

- Make new connect session to `mysql server` by `workbench`. Load the exported script

![image](https://github.com/tanlethanh/photoapp/assets/104194494/34841ba3-c42d-4cfe-abf8-5382f8eae9c1)
- Run this DDL script to init database

![image](https://github.com/tanlethanh/photoapp/assets/104194494/35f3078c-fa62-41e6-9add-656b25798365)

After above steps, database is ready for application

# NodeJS
Install all packages
```
npm install
```

This source base already has `eslint` config. You can install `eslint vscode extension`, then enable to use `linting` and `formating`

To connect with `database`, you must provide correct credentials, `root` is default username, password depends on your `set up`, database name `csc317db` from the DDL 

![image](https://github.com/tanlethanh/photoapp/assets/104194494/ac680ab4-3c7e-4c39-aee8-18f8deb3f877)

To start application
```
npm start
```

To run application with hot reload, for development
```
npm install -g nodemon # just need to install once
npm run dev # run dev mode
```
