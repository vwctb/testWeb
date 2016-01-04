create table member(
  id varchar2(12) primary key,
  passwd varchar2(12) not null,
  name varchar2(10) not null,
  email varchar2(30) not null,
  sns varchar2(50),
  register date not null
);