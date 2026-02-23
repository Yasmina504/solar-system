# Security Group for Web Server
resource "aws_security_group" "web" {
  name   = "web-sg"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "web-security-group"
  }
}

# EC2 Instance
resource "aws_instance" "web_server_1" {
  ami           = "ami-0fc5d935ebf8bc3bc"
  instance_type = "t2.micro"

  subnet_id                   = module.vpc.public_subnets[0]
  vpc_security_group_ids      = [aws_security_group.web.id]
  associate_public_ip_address = true

  key_name = "solar-system-key-final"

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y nodejs npm git
    git clone https://github.com/Yasmina504/solar-system.git /home/ec2-user/solar-system
    cd /home/ec2-user/solar-system
    npm install
    npm start
  EOF

  tags = {
    Name = "web-server-1"
  }
}
