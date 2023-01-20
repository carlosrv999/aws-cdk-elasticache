import { Vpc } from "aws-cdk-lib/aws-ec2";
import { NetworkLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Construct } from "constructs";

export interface INetworkLoadBalancerConstruct {
  readonly vpc: Vpc;
  readonly loadBalancerName: string;
}

export class NetworkLoadBalancerConstruct extends Construct {
  networkLoadBalancer: NetworkLoadBalancer;

  constructor(
    scope: Construct,
    id: string,
    props: INetworkLoadBalancerConstruct
  ) {
    super(scope, id);
  }
}
