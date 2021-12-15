import Layout from '@/views/layouts/admin/Layout';
import systemRouter from './system';
import cmsRouter from './cms';
import mRouter from './m';
import trainRouter from './train';
import payRouter from './pay';
import productRouter from './prod';
import creditService from './creditService';
// import crontabRouter from './crontab'

export default {
	admin: () => ({
		path: '/admin',
		component: Layout,
		hidden: true,
		name: 'admin',
		redirect: 'admin/dashboard',
		children: [
			{
				path: 'dashboard',
				component: () => import('@/views/admin/dashboard/index'),
				name: 'dashboard',
				meta: {
					title: '首页',
					icon: 'dashboard',
					noCache: true,
					affix: true
				}
			}
		]
	}),
	...systemRouter,
	...cmsRouter,
	...mRouter,
	...trainRouter,
	...payRouter,
	...productRouter,
	...creditService
	// ...crontabRouter
};
