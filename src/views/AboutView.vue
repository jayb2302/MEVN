<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
  <Tree :value="nodes" selectionMode="single" @node-select="onNodeSelect" />
  <div class="file-preview mt-4">
    <pre><code>{{ selectedFileContent }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import type { TreeNode } from 'primevue/treenode';

interface AppTreeNode extends TreeNode {
  parent?: AppTreeNode;
}

import { onMounted, ref } from "vue";
import Tree from "primevue/tree";
import { NodeService } from "@/service/NodeService";

const nodes = ref<AppTreeNode[]>([]);
const nodeService = new NodeService();
const selectedFileContent = ref("");

const onNodeSelect = async (node: AppTreeNode) => {
  if (!node.children) {
    const filePath = getFullPathFromNode(node); // You'll define this logic
    try {
      const response = await fetch(`/${filePath}`);
      const content = await response.text();
      selectedFileContent.value = content;
    } catch {
      selectedFileContent.value = "Error loading file.";
    }
  }
};

function getFullPathFromNode(node: AppTreeNode): string {
  const parts = [node.label];
  let current = node.parent;

  while (current) {
    parts.unshift(current.label);
    current = current.parent;
  }

  return parts.join('/');
}

onMounted(async () => {
  nodes.value = await nodeService.getTreeNodes();
});
</script>

<style>
@media (width < 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
