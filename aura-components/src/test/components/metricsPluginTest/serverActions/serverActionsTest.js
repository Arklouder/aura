({
    /**
     * Tests for ServerActionsMetricsPlugin.js
     */

    /**
     * Verify the method the plugin binds to is accessible.
     */
    testMethodAccessible: {
        test: function(cmp) {
            $A.test.assertDefined($A.clientService["ActionQueue"].prototype["getServerActions"]);
        }
    },

    /**
     * Verify the Action APIs ServerActionsMetricsPlugin.js uses are valid. If any of these asserts fails, the plugin
     * most likely need to be updated to reflect a change in production API.
     */
    testActionApi: {
        test: function(cmp) {
            // We're just checking the API, we don't need the plugin enabled
            $A.metricsService.disablePlugin("serverActions");

            var action = $A.get("c.aura://LabelController.getLabel"),
                name = "dynamic_label_for_test",
                section = "Section1";

            action.setParams({
                "name": name,
                "section": section
            });
            action.setCallback(this, function(){}, "SUCCESS");
            action.setCallback(this, function(){}, "ERROR");
            action.setCallback(this, function(){}, "INCOMPLETE");

            $A.test.assertDefined(action.getId);
            $A.test.assertDefined(action.isAbortable);
            $A.test.assertDefined(action.isStorable);
            $A.test.assertEquals(name, action.getParams()["name"]);
            $A.test.assertEquals(section, action.getParams()["section"]);
            $A.test.assertTrue(action.getDef().isServerAction());
            $A.test.assertEquals("aura://LabelController/ACTION$getLabel", action.getDef().toString());

            var successCallback = action.getCallback("SUCCESS");
            var errorCallback = action.getCallback("ERROR");
            var incompleteCallback = action.getCallback("INCOMPLETE");
            $A.test.assertDefined(successCallback);
            $A.test.assertDefined(errorCallback);
            $A.test.assertDefined(incompleteCallback);
            $A.test.assertNotEquals(successCallback, errorCallback);
            $A.test.assertNotEquals(successCallback, incompleteCallback);
            $A.test.assertNotEquals(errorCallback, incompleteCallback);
            $A.test.assertDefined(successCallback["s"]);
            $A.test.assertDefined(successCallback["fn"]);

            $A.enqueueAction(action);
            var queuedActions = $A.test.getActionQueue().getQueuedActions();
            var found = false;
            for (var i=0; i<queuedActions.length; i++) {
                var def = queuedActions[i].getDef().toString();
                if (def.indexOf("aura://LabelController/ACTION$getLabel") === 0) {
                    found = true;
                }
            }
            $A.test.assertTrue(found, "Enqueued action not found in ActionQueue via ActionQueue.getQueuedActions()");
        }
    }
})