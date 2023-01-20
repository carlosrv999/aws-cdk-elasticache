import * as cdk from "aws-cdk-lib";
import { CfnOutput, Tags } from "aws-cdk-lib";
import { Peer, Port } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { ContainerConstruct } from "../src/container/container.construct";
import { SampleAppContainer } from "../src/container/images.construct";
import { ElastiCacheConstruct } from "../src/elasticache/elasticache.construct";
import { VpcNetwork } from "../src/network/vpc.construct";

export class FlashTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    Tags.of(this).add("carlos", "test");

    const vpcNetwork = new VpcNetwork(this, "Vpc", {
      vpcName: "vpc-test",
    });

    const elasticache = new ElastiCacheConstruct(this, "ElastiCache", {
      vpc: vpcNetwork.vpc,
      elastiCacheName: "carlos",
    });

    const images = new SampleAppContainer(this, "ContainerImages");

    const containers = new ContainerConstruct(this, "containers", {
      containerImages: images,
      elastiCache: elasticache,
      vpc: vpcNetwork.vpc,
    });

    new CfnOutput(this, "test", {
      value: elasticache.elastiCache.attrRedisEndpointAddress,
    });
    new CfnOutput(this, "test2", {
      value: elasticache.elastiCache.attrRedisEndpointPort,
    });

    elasticache.redisSecurityGroup.addIngressRule(
      Peer.securityGroupId(
        containers.service.connections.securityGroups[0].securityGroupId
      ),
      Port.tcp(6379)
    );
  }
}
