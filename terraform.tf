provider "aws" {
  region = "eu-west-2"
}


# EC2
# resource "aws_instance" "adam_test_server" {
#   ami           = "ami-05c172c7f0d3aed00"
#   instance_type = "t2.micro"
#   tags = {
#     Name = "Serwer Testowy Adam"
#   }
# }

# VPC
# resource "aws_vpc" "adam_test_vpc_2_terra" {
#   cidr_block = "10.0.0.0/16"
#   instance_tenancy = "default"
#
#   tags = {
#     Name="Adam_VPC"
#     ADAM="wkladam"
#   }
# }
#
# # VPC_SUBNETS
# resource "aws_subnet" "adam_test_vpc_subnet_2" {
#   cidr_block = "10.0.0.0/16"
#   vpc_id = aws_vpc.adam_test_vpc_2_terra.id
#
#   tags = {
#     Name="Adam_VPC_SUBNET_2"
#   }
# }

# Duzy przykład, cała konfiguracja
resource "aws_vpc" "adam_vpc_2" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "tf-example"
  }
}

resource "aws_subnet" "adam_subnet_2" {
  vpc_id            = aws_vpc.adam_vpc_2.id
  cidr_block        = "10.0.0.0/24"
  availability_zone = var.availability_zone

  tags = {
    Name = "Adam Subnet 2 Terraform"
  }
}

resource "aws_network_interface" "adam_network" {
  subnet_id = aws_subnet.adam_subnet_2.id
  private_ips = ["10.10.1.77"]

  tags = {
    Name = "primary_network_interface"
  }
}

resource "aws_instance" "adam_instance_2" {
  ami           = var.ami
  instance_type = var.instance_type

  network_interface {
    network_interface_id = aws_network_interface.adam_network.id
    device_index         = 0
  }

  credit_specification {
    cpu_credits = "unlimited"
  }
}

# COUNT instance
# resource "aws_instance" "adam_instance_count" {
#   count = 5 # utworzenie serwerow
#   ami           = var.ami
#   instance_type = var.instance_type
#   tags = {
#     Name = "Server_${count.index}"
#   }
#   credit_specification {
#     cpu_credits = "unlimited"
#   }
# }