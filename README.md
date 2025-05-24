# Node_Project
Hosting Backend in AWS ECS:
1. Create a docker image using the command docker build -t <name> .
2. Create a private reposiroty in ECR.
3. While creating an URI is assigned to it and you need to enter the repo-name.
4. After creating the repo, In the top right you can see the view push command(these commands are used to push the docker image into ECR, run these commands in console.) 
5. Open ECS and click on clusters in the left pane and then create a cluster.
6. Give the cluster name and in infrastructure select fargate and click on create.
7. After the cluster successfully created, now in the left pane select task definition and click on create a new task definition.
8. Give task definition name, select aws fargate as launch type. Set up task size as per the requirement
9.  Task has container, Give container name and Image URI from ECR and in this add port mappings based on which port your app runs.
10. Add environment variables.
11. Now click on create task and task will be successfully created.
12. You can open the task and click on Deploy or go to clusters and run a task there.
13. Now if you open the task, you can see the public IP where your backend starts running.
14. You can check this by using postman.
15. Make sure your your public IP is whitelisted in MondoDB atlas.
16. Make sure your port is allowed in EC2 security groups.