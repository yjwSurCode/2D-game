import { TreeNode } from '../core/interfaces';

type compare<T, ID> = (value: TreeNode<T, ID>) => boolean;

export class TreeQuery<T, ID extends number | string = string> {
	constructor(private tree: Array<TreeNode<T, ID>> = []) {}

	searchNodesByDepth(predicate: compare<T, ID>): Array<TreeNode<T, ID>> {
		return this.searchByDepth(predicate, this.tree, false);
	}

	findNodeByDepth(predicate: compare<T, ID>): TreeNode<T, ID> | undefined {
		const nodes = this.searchByDepth(predicate, this.tree, false);
		return nodes[0];
	}

	searchNodesByBreadth(predicate: compare<T, ID>): Array<TreeNode<T, ID>> {
		return this.searchByBreadth(predicate, this.tree, false);
	}

	findNodeByBreadth(predicate: compare<T, ID>): TreeNode<T, ID> | undefined {
		const nodes = this.searchByBreadth(predicate, this.tree, false);
		return nodes[0];
	}

	private searchByDepth(
		predicate: compare<T, ID>,
		tree?: Array<TreeNode<T, ID>>,
		first?: boolean,
	): Array<TreeNode<T, ID>> {
		if (!tree) {
			return [];
		}

		if (first) {
			for (const node of tree) {
				const result = this.searchByDepth(predicate, node.children, first);

				if (result.length > 0) {
					return result;
				}
			}

			const result = tree.find((node) => predicate(node));
			return result ? [result] : [];
		} else {
			let result: Array<TreeNode<T, ID>> = [];

			for (const node of tree) {
				result = [...result, ...this.searchByDepth(predicate, node.children, first)];
			}

			return [...result, ...tree.filter((node) => predicate(node))];
		}
	}

	private searchByBreadth(
		predicate: compare<T, ID>,
		tree?: Array<TreeNode<T, ID>>,
		first?: boolean,
	): Array<TreeNode<T, ID>> {
		if (!tree) {
			return [];
		}

		if (first) {
			const result = tree.find((node) => predicate(node));

			if (result) {
				return [result];
			}

			for (const node of tree) {
				const r = this.searchByBreadth(predicate, node.children, first);

				if (r.length > 0) {
					return r;
				}
			}

			return [];
		} else {
			let result = tree.filter((node) => predicate(node));

			for (const node of tree) {
				result = [...result, ...this.searchByBreadth(predicate, node.children, first)];
			}

			return result;
		}
	}
}

export function sortTree<T, PK>(
	tree: Array<TreeNode<T, PK>> = [],
	compareFn?: (a: TreeNode<T, PK>, b: TreeNode<T, PK>) => number,
): void {
	for (const node of tree) {
		sortTree(node.children, compareFn);
	}

	tree.sort(compareFn);
}

export function buildTreeFromList<T, PK>(
	array: T[] = [],
	options: {
		idField?: string;
		pidField?: string;
	} = {},
): Array<TreeNode<T, PK>> {
	const idField = options.idField || 'id';
	const pidField = options.pidField || 'pid';

	const treeData: Array<TreeNode<T, PK>> = [];
	const tmpMap: any = {};
	const list: any = [...array];

	for (const node of list) {
		tmpMap[node[idField]] = {
			id: node[idField],
			pid: node[pidField],
			ancestorIds: [],
			attrs: node,
		};
	}

	for (const attrs of list) {
		const id = attrs[idField];
		const currentNode = tmpMap[id];
		const pid = attrs[pidField];
		let parentNode = tmpMap[pid];

		// 子孙节点
		if (id !== pid && parentNode) {
			if (!parentNode.children) {
				parentNode.children = [];
			}

			parentNode.children.push(currentNode);
			// 顶层节点
		} else {
			treeData.push(currentNode);
		}

		// 打包祖先id列表
		while (parentNode) {
			currentNode.ancestorIds.unshift(parentNode.id);

			parentNode = tmpMap[parentNode.pid];
		}
	}

	return treeData;
}

export function treeHasCycle<ID extends number | string = string>(id: ID, tree: Map<ID, ID>): boolean {
	let slow: ID | undefined = id;
	let fast: ID | undefined = id;

	while (true) {
		slow = tree.get(slow == null ? id : slow);

		if (slow == null) {
			return false;
		}

		fast = tree.get(fast == null ? id : fast);
		fast = fast != null ? tree.get(fast) : undefined;

		if (fast == null) {
			return false;
		}

		if (slow === fast) {
			return true;
		}
	}
}
