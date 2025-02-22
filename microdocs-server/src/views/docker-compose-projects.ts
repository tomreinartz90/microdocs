import { Project, ProjectNode, FlatList } from "@maxxton/microdocs-core/dist/domain";

declare var extention: string;

export default function ( env: string, projects: Array<Project>, projectNodes: Array<ProjectNode>, projectNodesFlat: Array<ProjectNode>, current: Project, currentNode?: ProjectNode ): any {
  const services: any = {};

  projectNodesFlat.forEach( ( projectNode: ProjectNode ) => {
    const service: any                    = buildService( projectNode );
    services[ service.container_name ] = service;
  } );

  if ( currentNode ) {
    const service: any                    = buildService( currentNode, true );
    services[ service.container_name ] = service;
  }

  function buildService( projectNode: ProjectNode, build: boolean = false ): any {
    const project     = projects.filter( p => p.info.title === projectNode.title && p.info.version === projectNode.version )[ 0 ];
    const service: any = {
      container_name: projectNode.title + '_' + projectNode.version,
      image: projectNode.title + ':' + projectNode.version,

    };
    if ( project && project.deploy ) {
      // Name of the container
      if ( project.deploy.containerName ) {
        service.container_name = project.deploy.containerName + '_' + projectNode.version;
      }
      // Image name
      if ( project.deploy.image ) {
        service.image = project.deploy.image;
      }
      // Expose ports
      if ( project.deploy.exposePorts ) {
        service.ports = project.deploy.exposePorts;
      }
      // Set enviroment variables
      if ( project.deploy.environment ) {
        service.environment = project.deploy.environment;
      }
    }
    // Link dependent projects
    if ( projectNode.dependencies && projectNode.dependencies.length > 0 ) {
      service.links = projectNode.dependencies.map( dependency => {
        // Find container name and alias
        let containerName: string = dependency.item.title + '_' + dependency.item.version;
        let alias: string         = dependency.item.title;
        const depProject           = projects.filter( p => p.info.title === dependency.item.title && p.info.version === dependency.item.version )[ 0 ];
        if ( depProject ) {
          if ( depProject.deploy && depProject.deploy.containerName ) {
            containerName = depProject.deploy.containerName + '_' + dependency.item.version;
          }
          if ( depProject.deploy && depProject.deploy.alias ) {
            alias = depProject.deploy.alias;
          }
        }
        return containerName + ':' + alias;
      } );
    }

    if ( build ) {
      service.build = (project.deploy && project.deploy.build) || '.';
    }

    return service;
  }

  // Return docker compose as an object
  return {
    extension: 'yml',
    body: {
      version: '2',
      services
    }
  };
}
