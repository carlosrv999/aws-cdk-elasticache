import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import {
  AppProtocol,
  Cluster,
  Compatibility,
  ContainerImage,
  FargateService,
  Protocol,
  TaskDefinition,
} from "aws-cdk-lib/aws-ecs";
import { Construct } from "constructs";
import { ElastiCacheConstruct } from "../elasticache/elasticache.construct";
import { SampleAppContainer } from "./images.construct";

export interface IContainerConstruct {
  readonly vpc: Vpc;
  readonly containerImages: SampleAppContainer;
  readonly elastiCache: ElastiCacheConstruct;
}

export class ContainerConstruct extends Construct {
  ecsCluster: Cluster;
  service: FargateService;

  constructor(scope: Construct, id: string, props: IContainerConstruct) {
    super(scope, id);

    this.ecsCluster = new Cluster(this, "FargateCluster", {
      vpc: props.vpc,
      clusterName: "test-name",
    });

    const taskDefinition = new TaskDefinition(this, "taskDefinition", {
      memoryMiB: "512",
      cpu: "256",
      compatibility: Compatibility.FARGATE,
    });

    const containerDefinition = taskDefinition.addContainer("sampleContainer", {
      image: ContainerImage.fromDockerImageAsset(
        props.containerImages.sampleContainer
      ),
      environment: {
        ["REDIS_HOST"]: props.elastiCache.elastiCache.attrRedisEndpointAddress,
        ["REDIS_PORT"]: props.elastiCache.elastiCache.attrRedisEndpointPort,
      },
      /*portMappings: [
        {
          containerPort: 3000,
          protocol: Protocol.TCP,
          appProtocol: AppProtocol.http,
        },
      ],*/
    });

    this.service = new FargateService(this, "service", {
      cluster: this.ecsCluster,
      taskDefinition,
      assignPublicIp: true,
    });
  }
}
