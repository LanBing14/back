import Vue from 'vue';
import vuescroll from 'vuescroll';
import loading from '@/components/loading/index';
import iconFront from '@/icons/iconfont/iconfont.js';
import Drawer from './Drawer/index';
import ColorPicker from './ColorPicker/index';
import VideoPlayer from 'vue-video-player'

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

import {
    // Affix,
    // Anchor,
    // AutoComplete,
    Alert,
    // Avatar,
    // BackTop,
    Badge,
    Breadcrumb,
    Button,
    Calendar,
    Card,
    // Collapse,
    // Carousel,
    // Cascader,
    Checkbox,
    Col,
    DatePicker,
    // Divider,
    Dropdown,
    Form,
    FormModel,
    Icon,
    Input,
    InputNumber,
    Layout,
    // List,
    ConfigProvider,
    message,
    Menu,
    Modal,
    notification,
    Pagination,
    Popconfirm,
    Popover,
    // Progress,
    Radio,
    // Rate,
    Row,
    Select,
    // Slider,
    Spin,
    // Steps,
    Switch,
    Table,
    // Transfer,
    Tree,
    // TreeSelect,
    Tabs,
    Tag,
    // TimePicker,
    // Timeline,
    Tooltip,
    // // Mention,
    Upload,
    // // version,
    // Drawer,
    // Skeleton,
    // Comment,
    // ConfigProvider,
    // Base,
} from 'ant-design-vue';

Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
// Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$confirm = function (content, title = '提示', cfg = {}) {
    return new Promise((resolve, reject) => {
        Modal.confirm({
            title,
            content,
            onOk() {
                resolve();
            },
            onCancel() {
                reject();
            },
            ...cfg
        });
    });
};

/* v1.1.3+ registration methods */
// Vue.use(Base);
// Vue.use(Affix);
// Vue.use(Anchor);
// Vue.use(AutoComplete);
Vue.use(Alert);
// Vue.use(Avatar);
// Vue.use(BackTop);
Vue.use(Badge);
Vue.use(Breadcrumb);
Vue.use(Button, {
    size: 'mini'
});
Vue.use(Calendar);
Vue.use(Card);
// Vue.use(Collapse);
// Vue.use(Carousel);
// Vue.use(Cascader);
Vue.use(Checkbox);
Vue.use(Col);
Vue.use(DatePicker);
// Vue.use(Divider);
// Vue.use(Drawer);
Vue.use(Dropdown);
Vue.use(Form);
Vue.use(FormModel);
Vue.use(Icon);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Layout);
// Vue.use(List);
Vue.use(ConfigProvider);
Vue.use(Menu);
Vue.use(Modal);
Vue.use(Pagination);
Vue.use(Popconfirm);
Vue.use(Popover);
// Vue.use(Progress);
Vue.use(Radio);
// Vue.use(Rate);
Vue.use(Row);
Vue.use(Select);
// Vue.use(Slider);
Vue.use(Spin);
// Vue.use(Steps);
Vue.use(Switch);
Vue.use(Table);
// Vue.use(Transfer);
Vue.use(Tree);
// Vue.use(TreeSelect);
Vue.use(Tabs);
Vue.use(Tag);
// Vue.use(TimePicker);
// Vue.use(Timeline);
Vue.use(Tooltip);
Vue.use(Upload);
// Vue.use(Skeleton);
// Vue.use(Comment);
// Vue.use(ConfigProvider);

const myIcon = Icon.createFromIconfontCN({
    scriptUrl: iconFront
});
Vue.component('svg-icon', myIcon);

const req = require.context('../icons/svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);

// 滚动条
Vue.use(vuescroll);
// loading
Vue.use(loading);
// 抽屉
Vue.use(Drawer)
// 视频播放
Vue.use(VideoPlayer)
// 颜色选择器
Vue.use(ColorPicker)
