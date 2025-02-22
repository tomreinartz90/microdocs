
import { ProjectSettingsRepositoryMock } from "./mocks/project-settings.repo.mock";
import { ProjectSettingsRepository } from "../../../repositories/project-settings.repo";
import { ProjectRepository } from "../../../repositories/project.repo";
import { ProjectRepositoryMock } from "./mocks/project.repo.mock";
import { ReportRepositoryMock } from "./mocks/report.repo.mock";
import { ReportRepository } from "../../../repositories/report.repo";
import { Injection, InjectionConfig } from "../../../injections";
import { ProjectService } from "../../project.service";
import { AggregationService } from "../../aggregation.service";
import { ProjectInfo, Problem, DependencyTypes, SchemaTypes, ParameterPlacings } from "@maxxton/microdocs-core/dist/domain";

describe( '#AggregationService:', () => {

  describe( '#checkProject', () => {

    it( '#check without problems', () => {
      // Arrange
      const projectSettingsRepo: ProjectSettingsRepository = new ProjectSettingsRepositoryMock();
      const projectRepo: ProjectRepository                 = new ProjectRepositoryMock();
      const reportRepo                                     = class extends ReportRepositoryMock {
        constructor() {
          super( {
            default: {
              'customer-project': {
                '1.0.0': {
                  info: new ProjectInfo('customer-project', 'test', '1.0.0', ['1.0.0']),
                  paths: {
                    '/api/v1/customers': {
                      get: {
                        controller: {
                          name: "com.example.manager.controller.CustomerController",
                          type: "controller",
                          file: "com/example/controller/CustomerController.java",
                        },
                        method: {
                          name: "findAll",
                          lineNumber: 38,
                        }
                      }
                    }
                  }
                }
              }
            }
          } );
        }
      };
      const injectable = new Injection( {
        projectRepository: ProjectRepositoryMock,
        projectSettingsRepository: ProjectSettingsRepositoryMock,
        reportRepository: reportRepo,
        projectService: ProjectService,
        aggregationService: AggregationService
      } as InjectionConfig );
      const target: AggregationService = injectable.AggregationService();
      const project = {
        info: new ProjectInfo('order-project', 'test', '1.0.0', ['1.0.0']),
        dependencies: {
          'customer-project': {
            type: DependencyTypes.REST,
            paths: {
              '/api/v1/customers': {
                get: {
                  controller: {
                    name: "com.example.manager.client.CustomerClient",
                    type: "client",
                    file: "com/example/client/CustomerClient.java",
                  },
                  method: {
                    name: "findAll",
                    lineNumber: 40,
                  }
                }
              }
            }
          }
        }
      };

      // act
      const result: Array<Problem> = target.checkProject( 'default', project);

      expect(result.length).toEqual( 0);
    } );

    it( '#check without forward problems', () => {
      // Arrange
      const projectSettingsRepo: ProjectSettingsRepository = new ProjectSettingsRepositoryMock();
      const projectRepo: ProjectRepository                 = new ProjectRepositoryMock();
      const reportRepo                                     = class extends ReportRepositoryMock {
        constructor() {
          super( {
            default: {
              'customer-project': {
                '1.0.0': {
                  info: new ProjectInfo('customer-project', 'test', '1.0.0', ['1.0.0', '2.0.0']),
                  paths: {
                    '/api/v1/customers': {
                      get: {
                        controller: {
                          name: "com.example.manager.controller.CustomerController",
                          type: "controller",
                          file: "com/example/controller/CustomerController.java",
                        },
                        method: {
                          name: "findAll",
                          lineNumber: 38,
                        }
                      }
                    }
                  }
                },
                '2.0.0': {
                  info: new ProjectInfo('customer-project', 'test', '2.0.0', ['1.0.0', '2.0.0']),
                  paths: {
                    '/api/v1/customers': {
                      get: {
                        parameters: [
                          {
                            'in': ParameterPlacings.QUERY,
                            type: SchemaTypes.NUMBER,
                            name: 'required',
                            required: true
                          }
                        ],
                        controller: {
                          name: "com.example.manager.controller.CustomerController",
                          type: "controller",
                          file: "com/example/controller/CustomerController.java",
                        },
                        method: {
                          name: "findAll",
                          lineNumber: 38,
                        }
                      }
                    }
                  }
                }
              }
            }
          } );
        }
      };
      const injectable = new Injection( {
        projectRepository: ProjectRepositoryMock,
        projectSettingsRepository: ProjectSettingsRepositoryMock,
        reportRepository: reportRepo,
        projectService: ProjectService,
        aggregationService: AggregationService
      } as InjectionConfig );
      const target: AggregationService = injectable.AggregationService();
      const project = {
        info: new ProjectInfo('order-project', 'test', '1.0.0', ['1.0.0']),
        dependencies: {
          'customer-project': {
            type: DependencyTypes.REST,
            paths: {
              '/api/v1/customers': {
                get: {
                  controller: {
                    name: "com.example.manager.client.CustomerClient",
                    type: "client",
                    file: "com/example/client/CustomerClient.java",
                  },
                  method: {
                    name: "findAll",
                    lineNumber: 40,
                  }
                }
              }
            }
          }
        }
      };

      // act
      const result: Array<Problem> = target.checkProject( 'default', project);

      expect(result.length).toEqual( 1);
    } );

    it( '#check without forward problems', () => {
      // Arrange
      const projectSettingsRepo: ProjectSettingsRepository = new ProjectSettingsRepositoryMock();
      const projectRepo: ProjectRepository                 = new ProjectRepositoryMock();
      const reportRepo                                     = class extends ReportRepositoryMock {
        constructor() {
          super( {
            default: {
              'customer-project': {
                '1.0.0': {
                  info: new ProjectInfo( 'customer-project', 'test', '1.0.0', [ '1.0.0', '2.0.0' ] ),
                  paths: {
                    '/api/v1/customers': {
                      get: {
                        controller: {
                          name: "com.example.manager.controller.CustomerController",
                          type: "controller",
                          file: "com/example/controller/CustomerController.java",
                        },
                        method: {
                          name: "findAll",
                          lineNumber: 38,
                        }
                      }
                    }
                  }
                }
              },
              'order-project': {
                '2.0.0': {
                  info: new ProjectInfo('order-project', 'test', '2.0.0', ['2.0.0']),
                  dependencies: {
                    'customer-project': {
                      type: DependencyTypes.REST,
                      paths: {
                        '/api/v1/customers': {
                          get: {
                            parameters: [
                              {
                                'in': ParameterPlacings.QUERY,
                                type: SchemaTypes.NUMBER,
                                name: 'required',
                                required: true
                              }
                            ],
                            controller: {
                              name: "com.example.manager.client.CustomerClient",
                              type: "client",
                              file: "com/example/client/CustomerClient.java",
                            },
                            method: {
                              name: "findAll",
                              lineNumber: 40,
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          } );
        }
      };
      const injectable = new Injection( {
        projectRepository: ProjectRepositoryMock,
        projectSettingsRepository: ProjectSettingsRepositoryMock,
        reportRepository: reportRepo,
        projectService: ProjectService,
        aggregationService: AggregationService
      } as InjectionConfig );
      const target: AggregationService = injectable.AggregationService();
      const project = {
        info: new ProjectInfo('customer-project', 'test', '1.0.0', ['1.0.0']),
        paths: {
          '/api/v1/customers': {
            get: {
              parameters: [
                {
                  'in': ParameterPlacings.QUERY,
                  type: SchemaTypes.NUMBER,
                  name: 'required',
                  required: true
                }
              ],
              controller: {
                name: "com.example.manager.controller.CustomerController",
                type: "controller",
                file: "com/example/controller/CustomerController.java",
              },
              method: {
                name: "findAll",
                lineNumber: 38,
              }
            }
          }
        }
      };

      // act
      const result: Array<Problem> = target.checkProject( 'default', project);

      expect(result.length).toEqual( 0);
    } );

  } );

} );
