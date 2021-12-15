import Layout from '@/views/layouts/admin/Layout';

export default {
	product: () => ({
		path: '/admin/product',
		component: Layout,
		name: 'product',
		meta: {
			title: '产品管理',
			icon: 'lock'
		},
		otherRole: true
	})
};
