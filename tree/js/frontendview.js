// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
function getKnotSubnodes(knotDidStr, knotContent, allKnots) {
  var subnodesDids = [];
  var subnodesBaseKnotDid = null;
  var subnodesBaseKnotContent = null;
  try {
    var did_subnodes = knotContent.split("@");
    if(did_subnodes.length == 2) {
      return[did_subnodes[1].split("&"), null, null, did_subnodes[0]]
    }
    var did_subnodesBaseDid_subnodesChanges = knotContent.split("#");
    var cdid = did_subnodesBaseDid_subnodesChanges[0];
    if(did_subnodes.length == 1 && did_subnodesBaseDid_subnodesChanges.length == 1) {
      return[[], null, null, cdid]
    }
    if(did_subnodesBaseDid_subnodesChanges.length >= 2) {
      subnodesBaseKnotDid = did_subnodesBaseDid_subnodesChanges[1];
      subnodesBaseKnotContent = allKnots[subnodesBaseKnotDid];
      subnodesDids = getKnotSubnodes(subnodesBaseKnotDid, subnodesBaseKnotContent, allKnots)[0]
    }
    if(did_subnodesBaseDid_subnodesChanges.length == 3) {
      subnodesDids = SybnodesChangesMonitor_restoreSubnodesList(subnodesDids, did_subnodesBaseDid_subnodesChanges[2])
    }
  }catch(e) {
  }
  return[subnodesDids, subnodesBaseKnotDid, subnodesBaseKnotContent, cdid]
}
function restoreTreeStructure(rootDId, dId, allKnots, ret_entrysCdidsListInOrderOfAppearence, ret_entrysCdidsToNodesMap) {
  var knotContent = allKnots[dId];
  var knotData = getKnotSubnodes(dId, knotContent, allKnots);
  var subnodesDIds = knotData[0];
  var sdid = knotData[1];
  var sdidKnot = knotData[2];
  var cdid = knotData[3];
  var restoredNode = deserializeKnot(rootDId, dId, knotContent, cdid, sdid, sdidKnot);
  ret_entrysCdidsListInOrderOfAppearence.push(cdid);
  ret_entrysCdidsToNodesMap[cdid] = restoredNode;
  for(var i = 0;i < subnodesDIds.length;i++) {
    restoredNode.insertSubnode(i, restoreTreeStructure(rootDId, subnodesDIds[i], allKnots, ret_entrysCdidsListInOrderOfAppearence, ret_entrysCdidsToNodesMap), true)
  }
  return restoredNode
}
function deserializeKnot(rootDId, knotDId, knotContent, cdId, sdId, sdIdKnot) {
  var serializedNodeData = {};
  if(knotDId === rootDId) {
    serializedNodeData["data"] = {"treeId":"none", "nextDId":0};
    serializedNodeData["type"] = NodeTypesEnum.SESSION
  }else {
    serializedNodeData["data"] = {"note":knotContent};
    serializedNodeData["type"] = NodeTypesEnum.TEXTNOTE
  }
  serializedNodeData["dId"] = knotDId;
  serializedNodeData["cdId"] = cdId;
  serializedNodeData["sdId"] = sdId;
  serializedNodeData["sdIdKnot"] = sdIdKnot;
  return deserializeNode(serializedNodeData)
}
function deserializeEntry(entryData) {
  try {
    var entryDataAsJSO = JSON.parse(entryData);
    var serializedNodeData = {};
    serializedNodeData["type"] = NodesTypesEnumNum2Str[Math.abs(entryDataAsJSO[0])];
    serializedNodeData["colapsed"] = !!(entryDataAsJSO[0] < 0);
    serializedNodeData["data"] = entryDataAsJSO[1];
    serializedNodeData["marks"] = entryDataAsJSO[2];
    return deserializeNode(serializedNodeData)
  }catch(e) {
    console.error("ENTRY DESERIALIZE ERROR", e, entryData);
    return new NodeNote({"note":"ENTRY DESERIALIZE ERROR:" + e + entryData})
  }
}
var dummyTreePersistenceManager = {registerTree:function(tree) {
}, treeUpdated:function() {
}, saveNow:function() {
}};
function buildTreeModel(rootDid, allKnots, ret_entrysCdidsListInOrderOfAppearence, ret_entrysCdidsToNodesMap) {
  var rootNode = restoreTreeStructure(rootDid, rootDid, allKnots, ret_entrysCdidsListInOrderOfAppearence, ret_entrysCdidsToNodesMap);
  return extentToTreeModel([rootNode], dummyTreePersistenceManager)
}
function setEntry(node, serializedEntryBody) {
  if(!node || !node.parent) {
    return
  }
  node.replaceSelfInTreeBy_mergeSubnodesAndMarks(deserializeEntry(serializedEntryBody))
}
function createTreeView(window_, treeModel, thisTreeTabIndex, dragedModelStorage, bottomMainPanelHeight) {
  var treeView = new TreeView(window_, treeModel, thisTreeTabIndex, dragedModelStorage, bottomMainPanelHeight, false);
  return treeView.currentSessionRowDom
}
window["buildTreeModel"] = buildTreeModel;
window["createTreeView"] = createTreeView;
window["setEntry"] = setEntry;

