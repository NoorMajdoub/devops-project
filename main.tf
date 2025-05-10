terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.20.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "myflaskapp" {
  name = "myflaskapp"

  build {
    path = "${path.module}"  # This should point to the directory containing the Dockerfile
  }
}

resource "docker_container" "myflaskapp" {
  name  = "myflaskapp"
  image = docker_image.myflaskapp.latest

  ports {
    internal = 5000
    external = 5000
  }
}
