'use strict';

describe('ClusterOverviewController', function(){
    var scope, createController;

    beforeEach(angular.mock.module('kopf'));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $injector){
        this.scope = $rootScope.$new();
        this.scope.client = {};
        this.AlertService = $injector.get('AlertService');
        this.IndexSettingsService = $injector.get('IndexSettingsService');
        this.ConfirmDialogService = $injector.get('ConfirmDialogService');
        this.createController = function() {
            return $controller('ClusterOverviewController', {$scope: this.scope}, this.IndexSettingsService, this.ConfirmDialogService, this.AlertService);
        };
        this.scope.updateModel=function(body) { body(); };
        this._controller = this.createController();
    }));

    //TESTS
    it('has an empty paginator with page size 5 and empty index and node filters when initialized', function(){
        // paginator
        expect(this.scope.index_paginator.getCollection()).toEqual([]);
        expect(this.scope.index_paginator.page).toEqual(1);
        expect(this.scope.index_paginator.page_size).toEqual(5);
        expect(this.scope.index_paginator.filter.name).toEqual("");
        expect(this.scope.index_paginator.filter.state).toEqual("");
        expect(this.scope.index_paginator.filter.hide_special).toEqual(true);
        expect(this.scope.index_paginator.filter.timestamp).toEqual(0);
        // page
        expect(this.scope.page.elements.length).toEqual(5);
        expect(this.scope.page.first).toEqual(0);
        expect(this.scope.page.last).toEqual(0);
        expect(this.scope.page.next).toEqual(false);
        expect(this.scope.page.previous).toEqual(false);
        // node filter
        expect(this.scope.node_filter.name).toEqual("");
        expect(this.scope.node_filter.master).toEqual(true);
        expect(this.scope.node_filter.data).toEqual(true);
        expect(this.scope.node_filter.client).toEqual(true);
        // node list
        expect(this.scope.nodes).toEqual([]);
    });

    it('should detect when cluster changes and update indices and nodes', function(){
        // paginator
        this.scope.cluster = { indices: [ 1, 2, 3 ], nodes: [ 3, 2, 1] };
        spyOn(this.scope, 'setIndices').andReturn(true);
        spyOn(this.scope, 'setNodes').andReturn(true);
        this.scope.$digest();
        expect(this.scope.setIndices).toHaveBeenCalledWith([1,2,3]);
        expect(this.scope.setNodes).toHaveBeenCalledWith([3,2,1]);
    });

    it('should detect when indices filter name changes and update indices', function(){
        // paginator
        this.scope.cluster = { indices: [], nodes: [] };
        this.scope.$digest();
        spyOn(this.scope, 'setIndices').andReturn(true);
        spyOn(this.scope, 'setNodes').andReturn(true);
        this.scope.index_paginator.filter.name = 'b';
        this.scope.$digest();
        expect(this.scope.setIndices).toHaveBeenCalledWith([]);
        expect(this.scope.setNodes).not.toHaveBeenCalled();
    });

    it('should detect when indices filter state changes and update indices', function(){
        // paginator
        this.scope.cluster = { indices: [], nodes: [] };
        this.scope.$digest();
        spyOn(this.scope, 'setIndices').andReturn(true);
        spyOn(this.scope, 'setNodes').andReturn(true);
        this.scope.index_paginator.filter.state = 'b';
        this.scope.$digest();
        expect(this.scope.setIndices).toHaveBeenCalledWith([]);
        expect(this.scope.setNodes).not.toHaveBeenCalled();
    });

    it('should detect when indices filter hide_special changes and update indices', function(){
        // paginator
        this.scope.cluster = { indices: [], nodes: [] };
        this.scope.$digest();
        spyOn(this.scope, 'setIndices').andReturn(true);
        spyOn(this.scope, 'setNodes').andReturn(true);
        this.scope.index_paginator.filter.hide_special = false;
        this.scope.$digest();
        expect(this.scope.setIndices).toHaveBeenCalledWith([]);
        expect(this.scope.setNodes).not.toHaveBeenCalled();
    });

    it('should detect when nodes filter name changes and updates nodes', function(){
        // paginator
        this.scope.cluster = { indices: [], nodes: [] };
        this.scope.$digest();
        spyOn(this.scope, 'setIndices').andReturn(true);
        spyOn(this.scope, 'setNodes').andReturn(true);
        this.scope.node_filter.name= "a";
        this.scope.$digest();
        expect(this.scope.setNodes).toHaveBeenCalledWith([]);
        expect(this.scope.setIndices).not.toHaveBeenCalled();
    });

    it('should detect when nodes filter data node filter changes and updates nodes', function(){
        // paginator
        this.scope.cluster = { indices: [], nodes: [] };
        this.scope.$digest();
        spyOn(this.scope, 'setIndices').andReturn(true);
        spyOn(this.scope, 'setNodes').andReturn(true);
        this.scope.node_filter.data= false;
        this.scope.$digest();
        expect(this.scope.setNodes).toHaveBeenCalledWith([]);
        expect(this.scope.setIndices).not.toHaveBeenCalled();
    });

    it('should detect when nodes filter master node filter changes and updates nodes', function(){
        // paginator
        this.scope.cluster = { indices: [], nodes: [] };
        this.scope.$digest();
        spyOn(this.scope, 'setIndices').andReturn(true);
        spyOn(this.scope, 'setNodes').andReturn(true);
        this.scope.node_filter.master= false;
        this.scope.$digest();
        expect(this.scope.setNodes).toHaveBeenCalledWith([]);
        expect(this.scope.setIndices).not.toHaveBeenCalled();
    });

    it('should detect when nodes filter client node filter changes and updates nodes', function(){
        // paginator
        this.scope.cluster = { indices: [], nodes: [] };
        this.scope.$digest();
        spyOn(this.scope, 'setIndices').andReturn(true);
        spyOn(this.scope, 'setNodes').andReturn(true);
        this.scope.node_filter.client= false;
        this.scope.$digest();
        expect(this.scope.setNodes).toHaveBeenCalledWith([]);
        expect(this.scope.setIndices).not.toHaveBeenCalled();
    });

    it('should correctly set nodes', function(){
        this.scope.setNodes([1,2,3]);
        expect(this.scope.nodes).toEqual([1,2,3]);
    });

    it('should correctly set indices', function(){
        this.scope.index_paginator.filter.hide_special = false;
        this.scope.setIndices([1,2,3]);
        expect(this.scope.page.elements).toEqual([1,2,3, null, null]);
        expect(this.scope.page.first).toEqual(1);
        expect(this.scope.page.last).toEqual(3);
        expect(this.scope.page.next).toEqual(false);
        expect(this.scope.page.previous).toEqual(false);
    });


    // shutdown node
    it('shutdownNode must invoke client method, display alert and refresh model', function(){
        this.scope.client.shutdownNode=function(node_id, success, failed) { return success(); };
        this.scope.refreshClusterState=function(){};
        spyOn(this.scope, "refreshClusterState").andReturn(true);
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "shutdownNode").andCallThrough();
        spyOn(this.AlertService, "success").andReturn(true);
        this.scope.shutdownNode("node_id");
        expect(this.scope.client.shutdownNode).toHaveBeenCalledWith("node_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.refreshClusterState).toHaveBeenCalled();
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.success).toHaveBeenCalled();
    });

    it('shutdownNode must display error message if operation fails', function(){
        this.scope.client.shutdownNode=function(node_id, success, failed) { return failed(); };
        spyOn(this.scope.client, "shutdownNode").andCallThrough();
        spyOn(this.AlertService, "error").andReturn(true);
        spyOn(this.scope, "updateModel").andCallThrough();
        this.scope.shutdownNode("node_id");
        expect(this.scope.client.shutdownNode).toHaveBeenCalledWith("node_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.error).toHaveBeenCalled();
    });

    // optimizeIndex
    it('optimizeIndex must invoke client method, display alert and refresh model', function(){
        this.scope.client.optimizeIndex=function(index, success, failed) { return success(); };
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "optimizeIndex").andCallThrough();
        spyOn(this.AlertService, "success").andReturn(true);
        this.scope.optimizeIndex("index_id");
        expect(this.scope.client.optimizeIndex).toHaveBeenCalledWith("index_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.success).toHaveBeenCalled();
    });

    it('optimizeIndex must display error message if operation fails', function(){
        this.scope.client.optimizeIndex=function(index, success, failed) { return failed(); };
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "optimizeIndex").andCallThrough();
        spyOn(this.AlertService, "error").andReturn(true);
        this.scope.optimizeIndex("index_id");
        expect(this.scope.client.optimizeIndex).toHaveBeenCalledWith("index_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.error).toHaveBeenCalled();
    });

    // delete index
    it('deleteIndex must invoke client method and refresh cluster state', function(){
        this.scope.client.deleteIndex=function(index, success, failed) { return success(); };
        this.scope.refreshClusterState=function(){};
        spyOn(this.scope, "refreshClusterState").andReturn(true);
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "deleteIndex").andCallThrough();
        spyOn(this.AlertService, "success").andReturn(true);
        this.scope.deleteIndex("index_id");
        expect(this.scope.client.deleteIndex).toHaveBeenCalledWith("index_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.refreshClusterState).toHaveBeenCalled();
    });

    it('deleteIndex must display message if operation fails', function(){
        this.scope.client.deleteIndex=function(index, success, failed) { return failed(); };
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "deleteIndex").andCallThrough();
        spyOn(this.AlertService, "error").andReturn(true);
        this.scope.deleteIndex("index_id");
        expect(this.scope.client.deleteIndex).toHaveBeenCalledWith("index_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.AlertService.error).toHaveBeenCalled();
        expect(this.scope.updateModel).toHaveBeenCalled();
    });

    // clear cache
    it('clearCache must invoke client method, display alert and refresh model', function(){
        this.scope.client.clearCache=function(index_id, success, failed) { return success(); };
        this.scope.refreshClusterState=function(){};
        spyOn(this.scope, "refreshClusterState").andReturn(true);
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "clearCache").andCallThrough();
        spyOn(this.AlertService, "success").andReturn(true);
        this.scope.clearCache("index_id");
        expect(this.scope.client.clearCache).toHaveBeenCalledWith("index_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.refreshClusterState).toHaveBeenCalled();
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.success).toHaveBeenCalled();
    });

    it('clearCache must display message if operation fails', function(){
        this.scope.client.clearCache=function(index_id, success, failed) { return failed(); };
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "clearCache").andCallThrough();
        spyOn(this.AlertService, "error").andReturn(true);
        this.scope.clearCache("index_id");
        expect(this.scope.client.clearCache).toHaveBeenCalledWith("index_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.error).toHaveBeenCalled();
    });

    // refresh index
    it('refreshIndex must invoke client method, display alert and refresh model', function(){
        this.scope.client.refreshIndex=function(index_id, success, failed) { return success(); };
        this.scope.refreshClusterState=function(){};
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "refreshIndex").andCallThrough();
        spyOn(this.AlertService, "success").andReturn(true);
        this.scope.refreshIndex("index_id");
        expect(this.scope.client.refreshIndex).toHaveBeenCalledWith("index_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.success).toHaveBeenCalled();
    });

    it('refreshIndex must display message if operation fails', function(){
        this.scope.client.refreshIndex=function(index_id, success, failed) { return failed(); };
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "refreshIndex").andCallThrough();
        spyOn(this.AlertService, "error").andReturn(true);
        this.scope.refreshIndex("index_id");
        expect(this.scope.client.refreshIndex).toHaveBeenCalledWith("index_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.error).toHaveBeenCalled();
    });

    // enable allocation
    it('enableAllocation must invoke client method, display alert and refresh model', function(){
        this.scope.client.enableShardAllocation=function(success, failed) { return success(); };
        this.scope.refreshClusterState=function(){};
        spyOn(this.scope, "refreshClusterState").andReturn(true);
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "enableShardAllocation").andCallThrough();
        spyOn(this.AlertService, "success").andReturn(true);
        this.scope.enableAllocation("node_id");
        expect(this.scope.client.enableShardAllocation).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.refreshClusterState).toHaveBeenCalled();
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.success).toHaveBeenCalled();
    });

    it('enableAllocation must display an error message if operations fails', function(){
        this.scope.client.enableShardAllocation=function(success, failed) { return failed(); };
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "enableShardAllocation").andCallThrough();
        spyOn(this.AlertService, "error").andReturn(true);
        this.scope.enableAllocation("node_id");
        expect(this.scope.client.enableShardAllocation).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.error).toHaveBeenCalled();
    });

    // disable allocation
    it('disableAllocation must invoke client method, display alert and refresh model', function(){
        this.scope.client.disableShardAllocation=function(success, failed) { return success(); };
        this.scope.refreshClusterState=function(){};
        spyOn(this.scope, "refreshClusterState").andReturn(true);
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "disableShardAllocation").andCallThrough();
        spyOn(this.AlertService, "success").andReturn(true);
        this.scope.disableAllocation("node_id");
        expect(this.scope.client.disableShardAllocation).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.refreshClusterState).toHaveBeenCalled();
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.success).toHaveBeenCalled();
    });

    it('disableAllocation must display an error message if operations fails', function(){
        this.scope.client.disableShardAllocation=function(success, failed) { return failed(); };
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "disableShardAllocation").andCallThrough();
        spyOn(this.AlertService, "error").andReturn(true);
        this.scope.disableAllocation("node_id");
        expect(this.scope.client.disableShardAllocation).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.error).toHaveBeenCalled();
    });

    // close index
    it('closeIndex must invoke client method, display alert and refresh model', function(){
        this.scope.client.closeIndex=function(index_id, success, failed) { return success(); };
        this.scope.refreshClusterState=function(){};
        spyOn(this.scope, "refreshClusterState").andReturn(true);
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "closeIndex").andCallThrough();
        spyOn(this.AlertService, "success").andReturn(true);
        this.scope.closeIndex("index_id");
        expect(this.scope.client.closeIndex).toHaveBeenCalledWith("index_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.refreshClusterState).toHaveBeenCalled();
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.success).toHaveBeenCalled();
    });

    it('closeIndex must display error message if operation fails', function(){
        this.scope.client.closeIndex=function(index_id, success, failed) { return failed(); };
        spyOn(this.scope.client, "closeIndex").andCallThrough();
        spyOn(this.AlertService, "error").andReturn(true);
        spyOn(this.scope, "updateModel").andCallThrough();
        this.scope.closeIndex("index_id");
        expect(this.scope.client.closeIndex).toHaveBeenCalledWith("index_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.error).toHaveBeenCalled();
    });

    // open index
    it('openIndex must invoke client method, display alert and refresh model', function(){
        this.scope.client.openIndex=function(index_id, success, failed) { return success(); };
        this.scope.refreshClusterState=function(){};
        spyOn(this.scope, "refreshClusterState").andReturn(true);
        spyOn(this.scope, "updateModel").andCallThrough();
        spyOn(this.scope.client, "openIndex").andCallThrough();
        spyOn(this.AlertService, "success").andReturn(true);
        this.scope.openIndex("index_id");
        expect(this.scope.client.openIndex).toHaveBeenCalledWith("index_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.refreshClusterState).toHaveBeenCalled();
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.success).toHaveBeenCalled();
    });

    it('openIndex must display error message if operation fails', function(){
        this.scope.client.openIndex=function(index_id, success, failed) { return failed(); };
        spyOn(this.scope.client, "openIndex").andCallThrough();
        spyOn(this.AlertService, "error").andReturn(true);
        spyOn(this.scope, "updateModel").andCallThrough();
        this.scope.openIndex("index_id");
        expect(this.scope.client.openIndex).toHaveBeenCalledWith("index_id", jasmine.any(Function), jasmine.any(Function));
        expect(this.scope.updateModel).toHaveBeenCalled();
        expect(this.AlertService.error).toHaveBeenCalled();
    });

});