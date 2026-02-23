output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "cluster_name" {
  value = module.eks.cluster_name
}

output "web_server_public_ip" {
  value = aws_instance.web_server_1.public_ip
}
