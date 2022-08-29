import Ajv from "ajv";
import { JSONParserError } from "./helpers/src/payload-validator";

const schemaJson = {
  $schema: "http://json-schema.org/draft-07/schema",
  $id: "permissionSetData",
  type: "object",
  title: "Permission Set Object",
  description: "Permission Set Object",
  required: ["permissionSetName"],
  properties: {
    permissionSetName: {
      $id: "#/properties/permissionSetName",
      type: "string",
      title: "Permission Set Name",
      description: "Permission Set Name",
      minLength: 1,
      maxLength: 32,
      pattern: "^[A-Za-z0-9\\+=,.@-]+$",
    },
    description: {
      $id: "#/properties/description",
      type: "string",
      title: "description",
      description: "Permission set description",
      minLength: 1,
      maxLength: 700,
      pattern: "[\\u0009\\u000A\\u000D\\u0020-\\u007E\\u00A1-\\u00FF]*",
    },
    sessionDurationInMinutes: {
      $id: "#/properties/sessionDurationInMinutes",
      type: "string",
      title: "sessionDurationInMinutes",
      description: "sessionDurationInMinutes",
      minLength: 1,
      pattern: "^(720|7[0-1][0-9]|[1-6][0-9][0-9]|[6-9][0-9])$",
    },
    relayState: {
      $id: "#/properties/relayState",
      type: "string",
      title: "relayState",
      description: "relayState",
      minLength: 1,
      maxLength: 240,
      pattern: "[A-Za-z0-9_:/=\\+\\-@#]+",
    },
    tags: {
      $id: "#/properties/tags",
      type: "array",
      title: "tags",
      description: "tags",
      default: [],
      items: {
        $id: "#/properties/tags/items",
        anyOf: [
          {
            $id: "#/properties/tags/items/anyOf/0",
            type: "object",
            title: "tag object",
            description: "tag object",
            default: {},
            required: ["Key", "Value"],
            properties: {
              Key: {
                $id: "#/properties/tags/items/anyOf/0/properties/Key",
                type: "string",
                title: "tag object key",
                description: "tag object key",
                minLength: 1,
                maxLength: 128,
                pattern: "^[A-Za-z0-9_:/=\\+\\-@]*$",
              },
              Value: {
                $id: "#/properties/tags/items/anyOf/0/properties/Value",
                type: "string",
                title: "tag object value",
                description: "tag object value",
                default: "",
                minLength: 0,
                maxLength: 256,
                pattern: "^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-@]*)$",
              },
            },
            additionalProperties: false,
          },
        ],
      },
    },
    managedPoliciesArnList: {
      $id: "#/properties/managedPoliciesArnList",
      type: "array",
      title: "The managedPoliciesArnList $schema",
      description: "An explanation about the purpose of this instance.",
      default: [],
      items: {
        $id: "#/properties/managedPoliciesArnList/items",
        anyOf: [
          {
            $id: "#/properties/managedPoliciesArnList/items/anyOf/0",
            type: "string",
            title: "Managed Policies $schema",
            description: "Managed Policies $schema",
            pattern: "arn:aws:iam::aws:policy/[A-Za-z]+",
          },
        ],
      },
    },
    customerManagedPoliciesList: {
      $id: "#/properties/customerManagedPoliciesList",
      type: "array",
      title: "List of customer managed policies to attach",
      description: "List of customer managed policies to attach",
      default: [],
      items: {
        anyOf: [
          {
            $id: "#/properties/customerManagedPoliciesList/items/anyOf/0",
            type: "object",
            title: "Customer Managed Policy object",
            required: ["Name"],
            properties: {
              Name: {
                $id: "#/properties/customerManagedPoliciesList/items/anyOf/0/propertites/Name",
                type: "string",
                title: "Customer Managed Policy Name",
                description: "Customer Managed Policy Name",
                minLength: 1,
                maxLength: 128,
                pattern: "[\\w+=,.@-]+",
              },
              Path: {
                $id: "#/properties/customerManagedPoliciesList/items/anyOf/0/propertites/Path",
                type: "string",
                title: "Customer Managed Policy path",
                description: "Customer Managed Policy path",
                minLength: 1,
                maxLength: 512,
                pattern: "(^(/[A-Za-z0-9\\.,\\+@=_-]+)*)/$",
              },
            },
            additionalProperties: false,
          },
        ],
      },
    },
    permissionsBoundary: {
      $id: "#/properties/permissionsBoundary",
      type: "object",
      title: "Permissions Boundary object $schema",
      description: "Permissions Boundary object schema",
      default: {},
      properties: {
        ManagedPolicyArn: {
          $id: "#/properties/permissionsBoundary/properties/managedPolicyArn",
          type: "string",
          title: "Managed Policies $schema",
          description: "Managed Policies $schema",
          pattern: "arn:aws:iam::aws:policy/[A-Za-z]+",
        },
        CustomerManagedPolicyReference: {
          type: "object",
          title: "Customer Managed Policy object",
          required: ["Name"],
          properties: {
            Name: {
              $id: "#/properties/permissionsBoundary/properties/CustomerManagedPolicyReference/properties/Name",
              type: "string",
              title: "Customer Managed Policy Name",
              description: "Customer Managed Policy Name",
              minLength: 1,
              maxLength: 128,
              pattern: "[\\w+=,.@-]+",
            },
            Path: {
              $id: "#/properties/permissionsBoundary/properties/CustomerManagedPolicyReference/properties/Path",
              type: "string",
              title: "Customer Managed Policy path",
              description: "Customer Managed Policy path",
              minLength: 1,
              maxLength: 512,
              pattern: "(^(/[A-Za-z0-9\\.,\\+@=_-]+)*)/$",
            },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
      oneOf: [
        {
          required: ["ManagedPolicyArn"],
        },
        {
          required: ["CustomerManagedPolicyReference"],
        },
      ],
    },
    inlinePolicyDocument: {
      $id: "#/properties/inlinePolicyDocument",
      type: "object",
      title: "The inlinePolicyDocument $schema",
      description: "Inline Policy Document",
      default: {},
      properties: {
        Version: {
          $id: "#/properties/inlinePolicyDocument/properties/Version",
          type: "string",
          title: "The Version $schema",
          description: "An explanation about the purpose of this instance.",
          enum: ["2012-10-17", "2008-10-17"],
          default: "2012-10-17",
        },
        Statement: {
          $id: "#/properties/inlinePolicyDocument/properties/Statement",
          type: "array",
          title: "The Statement $schema",
          description: "An explanation about the purpose of this instance.",
          default: [],
          items: {
            $id: "#/properties/inlinePolicyDocument/properties/Statement/items",
            anyOf: [
              {
                $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0",
                type: "object",
                title: "Statement object",
                description: "Statement object",
                default: {},
                required: ["Effect"],
                properties: {
                  Action: {
                    $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Action",
                    anyOf: [
                      {
                        $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Action/anyOf/0",
                        type: ["array"],
                        title: "The Action $schema",
                        description: "The permitted actions",
                        default: [],
                        items: {
                          $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Action/anyOf/0/items",
                          anyOf: [
                            {
                              $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Action/items/anyOf/0/items/anyOf/0",
                              type: "string",
                              title: "Permitted actions",
                              description: "The permitted actions",
                            },
                          ],
                        },
                      },
                      {
                        $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Action/anyOf/1",
                        type: "string",
                        title: "The Action $schema",
                        description: "The permitted actions",
                      },
                    ],
                  },
                  Resource: {
                    $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Resource",
                    anyOf: [
                      {
                        $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Resource/anyOf/0",
                        type: ["array"],
                        title: "The Resource $schema",
                        description: "The resource that has the permission",
                        default: [],
                        items: {
                          $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Resource/anyOf/0/items",
                          anyOf: [
                            {
                              $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Resource/anyOf/0/items/anyOf/0",
                              type: "string",
                              title: "Permitted resources",
                              description: "The permitted resources",
                            },
                          ],
                        },
                      },
                      {
                        $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Resource/anyOf/1",
                        type: "string",
                        title: "The Resource $schema",
                        description: "The resource that has the permission",
                      },
                    ],
                  },
                  Effect: {
                    $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Effect",
                    type: "string",
                    title: "The Effect $schema",
                    description: "Permission type",
                    enum: ["Allow", "Deny"],
                    default: "Allow",
                  },
                  Sid: {
                    $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Sid",
                    type: "string",
                    title: "The Sid $schema",
                    description:
                      "Statement id - optional identifier for the statement",
                  },
                  Condition: {
                    $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Condition",
                    type: "object",
                    title: "Condition object",
                    description: "Condition object",
                    default: {},
                  },
                  Principal: {
                    $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/Principal",
                    type: "object",
                    title: "Principal object",
                    description: "Principal object",
                    default: {},
                  },
                  NotPrincipal: {
                    $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/NotPrincipal",
                    type: "object",
                    title: "NotPrincipal object",
                    description: "NotPrincipal object",
                    default: {},
                  },
                  NotAction: {
                    $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/NotAction",
                    type: "array",
                    title: "The NotAction $schema",
                    description: "The non-permitted actions",
                    default: [],
                    items: {
                      $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/NotAction/items",
                      anyOf: [
                        {
                          $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/NotAction/items/anyOf/0",
                          type: "string",
                          title: "Non-permitted actions",
                          description: "The non-permitted actions",
                        },
                      ],
                    },
                  },
                  NotResource: {
                    $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/NotResource",
                    anyOf: [
                      {
                        $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/NotResource/anyOf/0",
                        type: ["array"],
                        title: "The NotResource $schema",
                        description:
                          "The resource that is excluded from the permission",
                        default: [],
                        items: {
                          $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/NotResource/anyOf/0/items",
                          anyOf: [
                            {
                              $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/NotResource/anyOf/0/items/anyOf/0",
                              type: "string",
                              title: "Non-permitted resources",
                              description: "The non permitted resources",
                            },
                          ],
                        },
                      },
                      {
                        $id: "#/properties/inlinePolicyDocument/properties/Statement/items/anyOf/0/properties/NotResource/anyOf/1",
                        type: "string",
                        title: "The NotResource $schema",
                        description:
                          "The resource that does not have the permission",
                      },
                    ],
                  },
                },
                additionalProperties: false,
              },
            ],
          },
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

const ajv = new Ajv({ allErrors: false });
const createUpdateValidation = ajv.compile(schemaJson);

const data = {
  permissionSetName: "testing.-space-ps@",
  sessionDurationInMinutes: "300",
  relayState:
    "https://eu-west-1.console.aws.amazon.com/console/home?region=eu-west-1#",
  tags: [
    {
      Key: "versionid",
      Value: "01",
    },
    {
      Key: "team",
      Value: "DataScientists",
    },
  ],
  managedPoliciesArnList: [
    "arn:aws:iam::aws:policy/job-function/DataScientist",
  ],
  inlinePolicyDocument: {},
};

if (createUpdateValidation(data)) {
  console.log("all good");
} else {
  console.log(JSON.stringify(createUpdateValidation.errors));

  console.log("line break");

  throw new JSONParserError(
    createUpdateValidation.errors!.map(({ instancePath, params }) => ({
      errorCode: `pattern-error`,
      message: `Schema validation failed for property ${instancePath} . Schema for property should match pattern ${params.pattern}`,
    }))
  );
}
