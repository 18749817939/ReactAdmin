与视频课的不同：
1、除了入口组件全部使用的函数式组件；
2、使用路由方法replace以及push时，使用的是hooks中的useHistory；
3、相应的，组件中的状态以及周期函数都是使用的hooks；
4、login组件中存储用户登陆信息直接存储在localLtorage中，没有再经过像视频中的转存；
5、category组件中没有使用两个数组分别存储一级和二级列表，而是直接存储为一个，使用hook监测parentId是否发生改变，发生改变则表示查看了二级列表，此时再重新发请求获取相应的列表，因此再返回一级列表和查看二级列表时只需要更改相应的parentId即可，同时一级和二级列表的异步显示也只需声明一次即可；
5、请求没有分别封装，封装为一个request，之后每次使用请求都调用request发送请求；
6、添加分类时，增加了直接在子分类里面添加该分类中的内容的功能；
7、添加修改商品的图片全部自己写，写的时候出现上传图片后显示不出来的情况，这是因为在上传图片时后台会自己生成图片的名字，应该使用这个名字，而我最开始使用的是自己图片的名字因此出现错误；
8、上传第二张图片时，该图片和原本已经存在的图片在同一个数组中，但是新上传的和原本上传的图片信息不一样，因为上传过的图片信息已经经过处理，因此在获取和显示图片时会报错，就是因为两种信息按照一种处理方式进行处理；
9、上传图片时，没有自己定义删除图片功能，可能是新版本的组件本身自带删除功能，也可能是因为我在修改图片时默认是要显示原来已经上传的图片，因此每次否是所有图片一起上传，后台也跟着一起更新全部，而不是只添加某一张图片；
10、商品详情没有使用富文本，使用了一个文本框代替，没有写添加和修改详情的功能；



写到一半发现原先使用的服务器不能使用，因此临时更换了服务器，接口地址都变了，下面这个是原来的服务器地址
// "http://120.55.193.14:5000"

key和parentId:
key是唯一标识，parentId是用于发送获取指定列表的请求的参数，一级列表是parentId为0时获取的数据，二级列表是获取一级列表中指定key的数据，即将key的值赋值给parentId