<template>
	<view>
		<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-'+ listCurID" :style="[{height:screenHeight+'px'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true" :scroll-top="scrollTop" @scroll="scroll">
			<block v-for="(item,index) in list" :key="index">
				<view :class="'indexItem-' + item.letter" :id="'indexes-' + item.letter" :data-index="item.letter">
					<view class="pd-lr blod title">{{item.letter}}</view>
					<view class="list-item flex-r-between pd-box" v-for="(el,sub) in item.list" :key="sub" @click="goDetail(el.oauthId)">
						<view class="flex">
							<!-- <view class="cu-avatar round lg">{{item.letter}}</view> -->
							<image :src="el.avatar" mode="widthFix" class="avatar mgr-20"></image>
							<view class="content">
								<view class="font-b">{{el.name}}</view>
								<view class="text-gray text-sm">
									<text class="mgr-20">{{el.originalNum}}篇原创</text>
									<text>{{el.fansNum}}粉丝</text>
								</view>
							</view>
						</view>
						<view class=" bg-default-color mgr-60 pd-lr btn flex-r-center" :class="{'followed':el.isFollowed,'white':!el.isFollowed}"
						 @click.stop="toggleFollowed(el,index,sub)">
							<text class="iconfont iconjiahao white small" v-if="!el.isFollowed"></text>
							<text>{{el.isFollowed?"已关注":"关注"}}</text>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		<view class="indexBar" :style="[{height:'calc(100vh - ' + CustomBar + 'px - 50px)'}]">
			<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
				<view class="indexBar-item" v-for="(item,index) in list" :key="index" :id="index" @touchstart="getCur" @touchend="setCur">
					{{item.letter}}</view>
			</view>
		</view>
		<!--选择显示-->
		<view v-show="!hidden" class="indexToast">
			{{listCur}}
		</view>
	</view>
</template>

<script>
	import {
		delRepArr
	} from "@/common/util/index.js"
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				screenHeight: this.screenHeight,
				hidden: true,
				listCurID: '',
				list: [],
				listCur: '',
				scrollTop: 0,
				old: {
					scrollTop: 0
				}
			};
		},
		onLoad() {
			this.init();
			// let list = [{}];
			// for (let i = 0; i < 26; i++) {
			// 	list[i] = {};
			// 	list[i].name = String.fromCharCode(65 + i);
			// }
			// this.list = list;

		},
		onReady() {
			let that = this;
			uni.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
				that.boxTop = res.top
			}).exec();
			uni.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
				that.barTop = res.top
			}).exec()
		},
		onPullDownRefresh() {
			this.init();
		},
		methods: {
			init() {
				this.api.home.hotVip.get_all_list(null, res => {
					console.log(res)
					console.log(delRepArr(res.data))
					this.list = delRepArr(res.data)
					this.listCur = this.list[0];
				})
			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			//获取文字信息
			getCur(e) {
				this.hidden = false;
				this.listCur = this.list[e.target.id].letter;
			},
			setCur(e) {
				this.hidden = true;
				this.listCur = this.listCur
			},
			//滑动选择Item
			tMove(e) {
				let y = e.touches[0].clientY,
					offsettop = this.boxTop,
					that = this;
				//判断选择区域,只有在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 20);
					this.listCur = that.list[num].letter
				};
			},

			//触发全部开始选择
			tStart() {
				this.hidden = false
			},

			//触发结束选择
			tEnd() {
				this.hidden = true;
				if (this.listCur == '#') {
					this.scrollTop = this.old.scrollTop
					this.$nextTick(function() {
						this.scrollTop = 0
					});
				} else {
					this.listCurID = this.listCur
				}
			},
			indexSelect(e) {
				let that = this;
				let barHeight = this.barHeight;
				let list = this.list;
				let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
				for (let i = 0; i < list.length; i++) {
					if (scrollY < i + 1) {
						that.listCur = list[i].name;
						that.movableY = i * 20
						return false
					}
				}
			},
			goDetail(id) {
				uni.navigateTo({
					url: "../detail/detail?id=" + id
				})
			},
			toggleFollowed(el, index, sub) {
				this.api.home.hotVip.toggle_followed({
					vid: el.oauthId,
					action: el.isFollowed ? 0 : 1
				}, res => {
					console.log(res)
					this.list[index].list[sub].isFollowed = !this.list[index].list[sub].isFollowed
				})
			}
		}
	}
</script>

<style lang="scss">
	.list-item {
		box-sizing: border-box;

		.avatar {
			width: 80upx;
			height: 80upx;
			border-radius: 50%;

		}

		.btn {
			height: 50upx;
			border-radius: 25upx;
			line-height: 50upx;
			border: 2upx solid $uni-color-default;
		}

		.followed {
			background-color: #ffffff;
			border-color: #f1f1f1;
		}
	}

	.indexes {
		position: relative;

		.title {
			background-color: #f5f5f5;
		}
	}

	.indexBar {
		position: fixed;
		right: 0px;
		top: 0upx;
		padding: 20upx 20upx 20upx 60upx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
</style>
