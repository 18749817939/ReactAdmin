import React, { useState, useEffect } from 'react'
import './Product.less'
import { useHistory, useLocation } from 'react-router-dom'
import { Card, Form, Spin, Input, Upload, Button, Cascader, message } from 'antd'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import { request, requestUrl } from '../../api/ajax'
const { TextArea } = Input
function AddUpdate(props) {
  let history = useHistory()
  let location = useLocation()
  const oldProduct = location.state
  const [defaultValue, setdefaultValue] = useState([])
  const arr = oldProduct ? oldProduct.imgs.map(img => ({
    uid: img,
    name: img,
    url: `http://123.56.75.70/upload/${img}`,
  })) : []
  const [fileList, setFileList] = useState(arr)
  const [loading, setLoading] = useState(false)
  const [imgName, setImgName] = useState(oldProduct ? oldProduct.imgs : [])
  const productBack = () => {
    history.replace('/home/product/home')
  }
  const [options, setOptions] = useState([])
  //获取一级分类列表，并进行包装给级联选择框使用，因为级联选择框只有固定的属性，因此为了方便获取二级
  //分类列表，将每个分类的—_id和name组合作为选择项的value属性值，使用时需要再拆分
  //每个分类的_id是作为category和pCategory发送给后台的
  const get = async (parentId) => {
    let parr;
    if (oldProduct && oldProduct.pCategoryId !== 0) {
      const presponse = await request(`${requestUrl}/category/get/${oldProduct.pCategoryId}`)
      parr = presponse.data.map(item => {
        const obj = {}
        obj.value = item.id + '_' + item.name
        obj.label = item.name
        obj.isLeaf = true
        obj.parentId = item.parentId
        return obj
      })
    }
    const response = await request(`${requestUrl}/category/get/${parentId}`);
    if (response.success) {
      const arr = response.data.map((item, index) => {
        const obj = {}
        obj.value = item.id + '_' + item.name
        obj.label = item.name
        obj.isLeaf = parentId === 0 ? false : true
        obj.parentId = item.parentId
        // console.log(obj.value)
        if (oldProduct && item.id === oldProduct.pCategoryId) {
          obj.children = parr
        }
        return obj
      })
      return arr
    } else {
      message.error('获取列表失败')
    }
  }
  const onFinish = async (values) => {
    const { name, desc, price, categoryId, detail } = values
    let parentId;
    let cateId;
    if(categoryId.length===2){
      parentId = Number(categoryId[0].split('_')[0])
      cateId = Number(categoryId[1].split('_')[0])
    }else{
      parentId = 0;
      cateId = Number(categoryId[0].split('_')[0])
    }
    const response = await request(`${requestUrl}/product/addupdata`,{
      id:oldProduct?oldProduct.key:null,name,desc,price,categoryId:cateId,pCategoryId:parentId,detail,imgName
    },'POST');
    // console.log(name, desc, price, imgName, detail, cateId, parentId)
    if (response.success) {
      history.replace('/home/product/home')
      message.success(`${oldProduct ? '修改' : '添加'}成功`)
    } else {
      message.error(`${oldProduct ? '修改' : '添加'}失败`)
    }
  }
  const onChangeOptions = (value, selectedOptions) => {
    // console.log(value, selectedOptions);
  }
  const loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true
    const key = targetOption.value.split('_', 2)[0]
    //动态获取二级分类列表
    setTimeout(async () => {
      targetOption.loading = false;
      await get(`${key}`).then(options => targetOption.children = options)
      targetOption.isLeaf = true
      setOptions([...options]);
    }, 500);
  };
  //修改商品时默认显示该商品分类，此处用于获取商品分类
  const getInfo = async () => {
    setLoading(true)
    const response = await request(`${requestUrl}/category/getById/${oldProduct.categoryId}`)
    const name = response.name;
    const pname = response.pname;
    let defaultValue = [];
    if (pname) {
      defaultValue = [`${oldProduct.pCategoryId}_${pname}`, `${oldProduct.categoryId}_${name}`]
    } else {
      defaultValue = [`${oldProduct.categoryId}_${name}`]
    }
    // console.log(defaultValue)
    setdefaultValue(defaultValue)
    setLoading(false)
  }
  const onChange = async ({ file, fileList: newFileList }) => {
    setFileList(newFileList);
    if (file.status === 'removed') {
      const name = file.response ? file.response.data.name : file.name
      const reponse = await request(`${requestUrl}/upload/img/delete`, { name: name }, 'POST')
      if (reponse.success) {
        let imgs = [];
        for(let p of imgName){
          if(p!==name){
            imgs = [...imgs,p]
          }
        }
        setImgName(imgs)
        message.success('删除成功') //防止服务器图片积累过多
      } else {
        message.error('删除失败')
      }
    } else if (file.status === 'done') {
      const name = file.response ? file.response.data.name : file.name
      setImgName([...imgName, name])
    }
  };
  //图片预览方式
  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  useEffect(() => {
    // console.log(oldProduct)
    get(0).then(arr => setOptions(arr))
    if (oldProduct) {
      getInfo()
    }
  }, [])
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传图片
      </div>
    </div>
  )
  return (
    // oldProduct ?
    loading ?
      <Spin size="large" className='spin' />
      : <div className='detail-container'>
        <Card title={
          <span>
            <ArrowLeftOutlined onClick={productBack} style={{ color: '#1DA57A' }} />
            &nbsp;&nbsp;{oldProduct ? '修改商品' : '添加商品'}
          </span>
        }
          className='detail'
        >
          <Form name="addupdate"
            className="addupdate"
            initialValues={{ remember: true }}
            onFinish={onFinish}>
            <Form.Item
              label="商品名称："
              className='addupdate-detail' name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input 商品名称!',
                },
              ]}
              initialValue={oldProduct ? oldProduct.name : ''}
            >
              <Input name="test1" style={{ width: '500px' }} />
            </Form.Item>
            <Form.Item
              label="商品描述："
              className='addupdate-detail' name="desc"
              rules={[
                {
                  required: true,
                  message: 'Please input 商品描述!',
                },
              ]}
              initialValue={oldProduct ? oldProduct.desc : ''}
            >
              <TextArea rows={2} placeholder="请输入商品描述" style={{ width: '500px' }} />
            </Form.Item>
            <Form.Item
              label="商品价格："
              className='addupdate-detail' name="price"
              rules={[
                {
                  required: true,
                  message: 'Please input 商品价格!',
                },
              ]}
              initialValue={oldProduct ? oldProduct.price : ''}

            >
              <Input prefix="￥" suffix="RMB" style={{ width: '500px' }} />
            </Form.Item>
            <Form.Item
              label="商品分类："
              className='addupdate-detail' name="categoryId"
              rules={[
                {
                  required: true,
                  message: 'Please select 商品分类!',
                },
              ]}
              initialValue={defaultValue}

            >
              <Cascader
                options={options}
                loadData={loadData}
                style={{ width: '500px' }}
                onChange={onChangeOptions}
                changeOnSelect
              // defaultValue={defaultValue}
              />
            </Form.Item>
            <Form.Item
              label="商品图片："
              className='addupdate-detail addupdate-detail-imgs'
              name="imgs"
              initialValue=''

            >
              <Upload
                action={`${requestUrl}/upload/img`}
                accept='image/*' //接受图片格式
                listType="picture-card"
                name='image'
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
              >
                {/* {fileList.length < 5 && '+上传图片'} */}
                {uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item
              label="商品详情："
              className='addupdate-detail addupdate-detail-imgs' name="detail"
              initialValue={oldProduct ? oldProduct.detail : ''}
            >
              <TextArea rows={2} placeholder="请输入商品详情" style={{ width: '500px' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    // : <div>meiyou</div>
  )
}

export default AddUpdate;