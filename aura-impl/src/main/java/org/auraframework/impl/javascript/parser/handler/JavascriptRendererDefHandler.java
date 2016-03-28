/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.auraframework.impl.javascript.parser.handler;

import java.util.Map;
import java.util.Set;

import org.auraframework.def.DefDescriptor;
import org.auraframework.def.RendererDef;
import org.auraframework.expression.PropertyReference;
import org.auraframework.impl.javascript.renderer.JavascriptRendererDef.Builder;
import org.auraframework.system.Source;
import org.auraframework.throwable.quickfix.QuickFixException;
import org.auraframework.util.json.JsFunction;

/**
 * This is a basic handler for a javascript renderer def.
 */
public class JavascriptRendererDefHandler extends JavascriptHandler<RendererDef, RendererDef> {

    private final Builder builder = new Builder();
    private final String[] ALLOWED_METHODS = {"render", "afterRender", "rerender", "unrender"};

    public JavascriptRendererDefHandler(DefDescriptor<RendererDef> descriptor, Source<?> source) {
        super(descriptor, source);
    }

    @Override
    protected RendererDef createDefinition(Map<String, Object> map) throws QuickFixException {
        setDefBuilderFields(builder);
        for (String key : ALLOWED_METHODS) {
            Object value = map.get(key);
            if (value != null && value instanceof JsFunction) {
                ((JsFunction) value).setName(key);
                builder.addFunction(key, value);
            }
        }
        return builder.build();
    }

    @Override
    public void addExpressionReferences(Set<PropertyReference> propRefs) {
        builder.expressionRefs.addAll(propRefs);
    }

    @Override
    protected RendererDef createDefinition(Throwable error) {
        setDefBuilderFields(builder);
        builder.setParseError(error);
        return builder.build();
    }

}
