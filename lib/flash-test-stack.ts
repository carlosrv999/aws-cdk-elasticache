import * as cdk from "aws-cdk-lib";
import { Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
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
  }
}
