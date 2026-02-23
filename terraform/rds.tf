resource "aws_db_instance" "mysql_master" {
  identifier = "mysqlinstancem"
  engine     = "mysql"
  engine_version = "8.0"
  instance_class = "db.t3.micro"
  
  allocated_storage = 20
  db_name  = "smarttodo"
  username = "admin"
  password = "Admin123456"
  
  vpc_security_group_ids = [aws_security_group.mysql.id]
  db_subnet_group_name   = aws_db_subnet_group.mysql.name
  
  multi_az = true
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = true
  
  tags = {
    Name = "MySQL Instance M"
  }
}

resource "aws_security_group" "mysql" {
  name   = "mysql-sg"
  vpc_id = module.vpc.vpc_id
  
  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "mysql-security-group"
  }
}

resource "aws_db_subnet_group" "mysql" {
  name       = "mysql-subnet-group"
  subnet_ids = module.vpc.private_subnets
  
  tags = {
    Name = "mysql-subnet-group"
  }
}
