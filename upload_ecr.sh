# Build docker
docker-compose up --build

# Push container to ECR
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 784579398270.dkr.ecr.ap-northeast-2.amazonaws.com
docker tag formbricks-formbricks:latest 784579398270.dkr.ecr.ap-northeast-2.amazonaws.com/formbuilder:latest
docker push 784579398270.dkr.ecr.ap-northeast-2.amazonaws.com/formbuilder:latest

# Access to EC2
ssh -i ~/.ssh/aaron_bside_key.pem ubuntu@3.35.105.190

cd formbricks
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 784579398270.dkr.ecr.ap-northeast-2.amazonaws.com
docker pull 784579398270.dkr.ecr.ap-northeast-2.amazonaws.com/formbuilder:latest
docker-compose up -d