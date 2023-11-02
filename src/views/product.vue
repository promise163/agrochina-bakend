<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-form  :inline="true" :model="query">
					<el-form-item label="状态" class="handle-select mr10">
						<el-select v-model="query.status" placeholder="" clearable>
							<el-option label="已发布" value="1"></el-option>
							<el-option label="未发布" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="产品类型" class="handle-select mr10">
						<el-select v-model="query.productType" placeholder="" clearable>
							<el-option label="Herbicide" value="1"></el-option>
							<el-option label="Insecticide" value="2"></el-option>
							<el-option label="Fungicide" value="3"></el-option>
							<el-option label="Rodenticide" value="4"></el-option>
							<el-option label="Plant Growth Regulator" value="5"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" show-overflow-tooltip align="center" header-cell-class-name="table-header">
				<el-table-column width="220" prop="title" label="产品名称" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column width="220" prop="title" label="产品类型" show-overflow-tooltip align="center">
                    <template #default="scope">
                        <p v-if="scope.row.productType == '1'">Herbicide</p>
                        <p v-if="scope.row.productType == '2'">Insecticide</p>
                        <p v-if="scope.row.productType == '3'">Fungicide</p>
                        <p v-if="scope.row.productType == '4'">Rodenticide</p>
                        <p v-if="scope.row.productType == '5'">Plant Growth Regulator</p>
                    </template>
                </el-table-column>
				<el-table-column width="300" prop="description" label="简述" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="封面(查看大图)" align="center">
					<template #default="scope">
						<el-image
							class="table-td-thumb"
							:src="scope.row.coverImgUrl"
							:z-index="10"
							:preview-src-list="[scope.row.coverImgUrl]"
							preview-teleported
						>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="createBy" label="发布人" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="状态" align="center">
					<template #default="scope">
						<el-tag
							:type="scope.row.status === '1' ? 'success' : scope.row.status === '失败' ? 'danger' : ''"
						>
							{{ scope.row.status == '1'?'已发布':'未发布' }}
						</el-tag>
					</template>
				</el-table-column>

				<!-- <el-table-column prop="createTime" label="发布时间"></el-table-column> -->
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text :icon="scope.row.status=='1'?Download:Upload"  :class="scope.row.status=='1'?'blue':'green'" @click="handleEdit(scope.row)" v-permiss="15">
							{{scope.row.status == '1' ? '下架' : '发布'}}
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.row.id)" v-permiss="16">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					layout="total, prev, pager, next"
					:current-page="query.pageNum"
					:page-size="query.pageSize"
					:total="total"
					@current-change="handlePageChange"
					hide-on-single-page
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="用户名">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="地址">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus ,Download,Upload} from '@element-plus/icons-vue';
import { fetchNewsList ,fetchNewsDetele ,fetchNewsStatus } from '../api/index';

interface TableItem {
	title: string;
	description: string;
	createBy: string;
	status: string;
	publishTime:string;
}

const query = reactive({
	status: '',
	productType:'',
	type:2,
	pageNum: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const total = ref(0);
// 获取表格数据
const getData = () => {
	fetchNewsList(query).then(res => {
		res = res.data.data
		tableData.value = res.records;
		total.value = res.total;
	});
};
// 查询操作
const handleSearch = () => {
	query.pageNum = 1;
	getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageNum = val;
	getData();
};

// 删除操作
const handleDelete = (id: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			fetchNewsDetele(id).then(res=>{
				res = res.data
				if(res.code == '0'){
					ElMessage.success('删除成功');
					handleSearch()
				}else{
					ElMessage.success('删除失败');
				}
			})
		})
		.catch(() => {});
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
	name: '',
	address: ''
});
const handleEdit = (row: any) => {
	// 产品状态改变
	fetchNewsStatus({id:row.id,status:row.status ==1?2:1,type:2}).then(res=>{
		res = res.data
		if(res.code == '0'){
			ElMessage.success('更新成功');
			handleSearch()
		}else{
			ElMessage.success('更新失败');
		}
	})
};
const saveEdit = () => {
	editVisible.value = false;
	ElMessage.success(`修改第 ${idx + 1} 行成功`);
	tableData.value[idx].name = form.name;
	tableData.value[idx].address = form.address;
};
</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 220px;
}

.handle-input {
	width: 300px;
}
.table {
	width: 100%;
	font-size: 14px;
}
.red {
	color: #F56C6C;
}
.blue{
	color:#409eff;
}
.green{
	color:#67c23a;
}
.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}

.pagination {
    height: 80px;
    padding: 15px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
