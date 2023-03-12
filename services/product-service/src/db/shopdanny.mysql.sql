CREATE DATABASE IF NOT EXISTS  shopdanny;

use shopdanny;

drop table IF EXISTS Stocks;
drop table IF EXISTS Products;

CREATE TABLE IF NOT EXISTS Products (
	id char(40) PRIMARY KEY not null,
    title varchar(100) not null,
    description varchar(200) not null,
    price int not null
);

CREATE TABLE IF NOT EXISTS Stocks (
	product_id char(40) PRIMARY KEY NOT NULL,
    count INT NOT NULL,
	FOREIGN KEY (product_id)  REFERENCES Products (id)
)