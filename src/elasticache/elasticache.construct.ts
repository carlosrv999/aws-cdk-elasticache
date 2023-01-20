import {
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { CfnCacheCluster, CfnSubnetGroup } from "aws-cdk-lib/aws-elasticache";
import { Construct } from "constructs";

export interface IElastiCacheConstruct {
  readonly elastiCacheName: string;
  readonly vpc: Vpc;
  readonly redis_port: number;
}

export class ElastiCacheConstruct extends Construct {
  subnetGroup: CfnSubnetGroup;
  redisSecurityGroup: SecurityGroup;
  elastiCache: CfnCacheCluster;

  constructor(scope: Construct, id: string, props: IElastiCacheConstruct) {
    super(scope, id);

    this.subnetGroup = new CfnSubnetGroup(this, "defaultSubnetGroup", {
      subnetIds: props.vpc.selectSubnets({
        subnetType: SubnetType.PRIVATE_ISOLATED,
      }).subnetIds,
      description: "test",
      cacheSubnetGroupName: "defaultSubnetGroup",
    });

    this.redisSecurityGroup = new SecurityGroup(this, "redis-secgroup", {
      vpc: props.vpc,
      allowAllOutbound: true,
      description: "Security Group for Redis cluster",
    });

    this.elastiCache = new CfnCacheCluster(this, "rediscache", {
      cacheNodeType: "cache.t2.small",
      engine: "redis",
      numCacheNodes: 1,
      vpcSecurityGroupIds: [this.redisSecurityGroup.securityGroupId],
      engineVersion: "7.0",
      port: props.redis_port,
      clusterName: props.elastiCacheName,
      cacheSubnetGroupName: this.subnetGroup.cacheSubnetGroupName,
    });
  }
}
