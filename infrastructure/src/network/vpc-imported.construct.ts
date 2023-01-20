import { IVpc, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export interface IVpcNetworkProps {
  readonly vpcId: string;
}

export class VpcNetwork extends Construct {
  vpc: IVpc;

  constructor(scope: Construct, id: string, props: IVpcNetworkProps) {
    super(scope, id);

    this.vpc = Vpc.fromLookup(this, "vpc", {
      vpcId: props.vpcId,
    });
  }
}
