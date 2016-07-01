package com.maxxton.microdocs.crawler.core.collector;

import com.maxxton.microdocs.crawler.core.builder.ComponentBuilder;
import com.maxxton.microdocs.crawler.core.collector.Collector;
import com.maxxton.microdocs.crawler.core.domain.component.ComponentType;
import com.maxxton.microdocs.crawler.core.reflect.ReflectAnnotation;
import com.maxxton.microdocs.crawler.core.reflect.ReflectClass;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class ComponentCollector implements Collector<ComponentBuilder> {

    private final Map<String, ComponentType> types;

    public ComponentCollector(Map<String, ComponentType> types) {
        this.types = types;
    }

    @Override
    public List<ComponentBuilder> collect(List<ReflectClass<?>> classes) {
        List<ComponentBuilder> componentBuilders = new ArrayList();
        for (ReflectClass<?> reflectClass : classes) {
            for (ReflectAnnotation annotation : reflectClass.getAnnotations()) {
                ComponentType type = null;
                for (Map.Entry<String, ComponentType> entry : types.entrySet()) {
                    if (annotation.getName().equals(entry.getKey()) || annotation.getSimpleName().equals(entry.getKey())) {
                        type = entry.getValue();
                        break;
                    }
                }
                if (type == null) {
                    break;
                }
                List<String> authors = new ArrayList();
                reflectClass.getDescription().getTags("author").forEach(tag -> authors.add(tag.getDescription()));
                ComponentBuilder componentBuilder = new ComponentBuilder()
                        .name(reflectClass.getName())
                        .simpleName(reflectClass.getSimpleName())
                        .authors(authors)
                        .type(type)
                        .description(reflectClass.getDescription().getText());
                //todo: check methods, dependencies and annotations
                componentBuilders.add(componentBuilder);
            }

        }
        return componentBuilders;
    }

}