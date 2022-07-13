import {
  HomeOutlined,
  QrcodeOutlined,
  UserOutlined,
  SafetyOutlined,
  UnorderedListOutlined,
  ToolOutlined,
} from '@ant-design/icons';
export const menuList = [
  {
    title: '首页',
    key: '/home/center',
    icon: <HomeOutlined />
  },
  {
    title: '商品',
    key: '商品',
    icon: <QrcodeOutlined />,
    children: [
      {
        title: '品类管理',
        key: '/home/category',
        icon: <UnorderedListOutlined />
      },
      {
        title: '商品管理',
        key: '/home/product',
        icon: <ToolOutlined />
      }
    ]
  },
  {
    title: '用户管理',
    key: '/home/user',
    icon: <UserOutlined />
  },
  {
    title: '角色管理',
    key: '/home/role',
    icon: <SafetyOutlined />
  },
  // {
  //   title: '图形图标',
  //   key: '图形图标',
  //   icon: <AreaChartOutlined />,
  //   children: [
  //     {
  //       title: '柱形图',
  //       key: '/home/chartpillar',
  //       icon: <BarChartOutlined />
  //     },
  //     {
  //       title: '折线图',
  //       key: '/home/chartline',
  //       icon: <LineChartOutlined />
  //     },
  //     {
  //       title: '饼图',
  //       key: '/home/chartcircle',
  //       icon: <PieChartOutlined />
  //     }
  //   ]
  // },
]