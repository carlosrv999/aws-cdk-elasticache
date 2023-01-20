import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { Construct } from "constructs";

export class SampleAppContainer extends Construct {
  sampleContainer: DockerImageAsset;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.sampleContainer = new DockerImageAsset(this, "sampleContainer", {
      directory: "../app",
    });
  }
}
