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
}

export class ElastiCacheConstruct extends Construct {
  subnetGroup: CfnSubnetGroup;
  subnetGroupPublic: CfnSubnetGroup;
  redisSecurityGroup: SecurityGroup;
  redisSecurityGroupPublic: SecurityGroup;
  elastiCache: CfnCacheCluster;
  elastiCachePublic: CfnCacheCluster;

  constructor(scope: Construct, id: string, props: IElastiCacheConstruct) {
    super(scope, id);

    this.subnetGroup = new CfnSubnetGroup(this, "defaultSubnetGroup", {
      subnetIds: props.vpc.selectSubnets({
        subnetType: SubnetType.PRIVATE_ISOLATED,
      }).subnetIds,
      description: "test",
      cacheSubnetGroupName: "defaultSubnetGroup",
    });

    this.subnetGroupPublic = new CfnSubnetGroup(
      this,
      "defaultSubnetGroupPublic",
      {
        subnetIds: props.vpc.selectSubnets({
          subnetType: SubnetType.PUBLIC,
        }).subnetIds,
        description: "test2",
        cacheSubnetGroupName: "defaultSubnetGroupPublic",
      }
    );

    this.redisSecurityGroup = new SecurityGroup(this, "redis-secgroup", {
      vpc: props.vpc,
      allowAllOutbound: true,
      description: "Security Group for Redis cluster",
    });

    this.redisSecurityGroupPublic = new SecurityGroup(
      this,
      "redis-secgroup-public",
      {
        vpc: props.vpc,
        allowAllOutbound: true,
        description: "Security Group for Redis cluster public",
      }
    );

    this.elastiCache = new CfnCacheCluster(this, "rediscache", {
      cacheNodeType: "cache.t2.small",
      engine: "redis",
      numCacheNodes: 1,
      vpcSecurityGroupIds: [this.redisSecurityGroup.securityGroupId],
      engineVersion: "7.0",
      clusterName: props.elastiCacheName,
      cacheSubnetGroupName: this.subnetGroup.cacheSubnetGroupName,
    });

    this.elastiCachePublic = new CfnCacheCluster(this, "rediscachepublic", {
      cacheNodeType: "cache.t2.small",
      engine: "redis",
      numCacheNodes: 1,
      vpcSecurityGroupIds: [this.redisSecurityGroup.securityGroupId],
      engineVersion: "7.0",
      clusterName: "rediscachepublic",
      cacheSubnetGroupName: this.subnetGroup.cacheSubnetGroupName,
    });
  }
}
