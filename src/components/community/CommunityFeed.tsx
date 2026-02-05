import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, MapPin } from 'lucide-react';

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: string;
    isVerified?: boolean;
  };
  content: {
    text: string;
    image?: string;
    tags: string[];
  };
  stats: {
    likes: number;
    comments: number;
    views: string;
  };
  timeAgo: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    user: {
      name: 'م. أحمد العمران',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
      role: 'Pro Provider',
      isVerified: true
    },
    content: {
      text: 'تم الانتهاء بحمد الله من تصميم فيلا مودرن في حي الياسمين. ركزنا على استغلال الإضاءة الطبيعية والمساحات المفتوحة. 🏡✨ #تصميم_داخلي #مودرن #بيت_الريف',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
      tags: ['تصميم', 'تنفيذ', 'الرياض']
    },
    stats: {
      likes: 245,
      comments: 42,
      views: '1.2k'
    },
    timeAgo: 'منذ ساعتين'
  },
  {
    id: '2',
    user: {
      name: 'شركة البناء المتقدمة',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AC',
      role: 'Enterprise',
      isVerified: true
    },
    content: {
      text: 'بدء أعمال الحفر والأساسات لمشروع المجمع التجاري الجديد. نستخدم أحدث تقنيات فحص التربة لضمان الاستدامة. 🏗️🚧',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
      tags: ['مقاولات', 'حفر', 'مشاريع_تجارية']
    },
    stats: {
      likes: 189,
      comments: 15,
      views: '850'
    },
    timeAgo: 'منذ 5 ساعات'
  },
  {
    id: '3',
    user: {
      name: 'سارة الديكور',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      role: 'Freelancer',
      isVerified: false
    },
    content: {
      text: 'أفكار لتنسيق غرف المعيشة الصغيرة باستخدام الألوان الفاتحة والمرايا. 🛋️🎨 رأيكم يهمنا!',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
      tags: ['ديكور', 'نصائح', 'أثاث']
    },
    stats: {
      likes: 567,
      comments: 89,
      views: '3.4k'
    },
    timeAgo: 'أمس'
  }
];

export function CommunityFeed() {
  return (
    <div className="w-full max-w-2xl mx-auto py-4 space-y-6 font-cairo" dir="rtl">
      
      {/* Feed Header */}
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-xl font-bold text-gray-900">مجتمع بيت الريف</h2>
        <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors">
          استكشف المزيد
        </button>
      </div>

      {/* Posts */}
      {MOCK_POSTS.map((post) => (
        <article key={post.id} className="bg-white border-y md:border border-gray-100 md:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200" />
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-sm text-gray-900">{post.user.name}</h3>
                  {post.user.isVerified && (
                    <span className="text-blue-500">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                   <span>{post.user.role}</span>
                   <span>•</span>
                   <span>{post.timeAgo}</span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-3">
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line mb-3">
              {post.content.text}
            </p>
            <div className="flex flex-wrap gap-1 mb-2">
              {post.content.tags.map(tag => (
                <span key={tag} className="text-blue-600 text-xs font-bold">#{tag}</span>
              ))}
            </div>
          </div>

          {/* Post Image */}
          {post.content.image && (
            <div className="w-full aspect-[4/3] bg-gray-100 relative">
               <img src={post.content.image} alt="Post content" className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}

          {/* Post Actions */}
          <div className="p-3">
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                   <button className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors group">
                      <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                   </button>
                   <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-6 h-6" />
                   </button>
                   <button className="flex items-center gap-1 text-gray-600 hover:text-green-500 transition-colors">
                      <Share2 className="w-6 h-6" />
                   </button>
                </div>
                <button className="text-gray-600 hover:text-yellow-500">
                   <Bookmark className="w-6 h-6" />
                </button>
             </div>
             
             <div className="text-sm font-bold text-gray-900">
               {post.stats.likes} إعجاب
             </div>
             <button className="text-xs text-gray-500 mt-1 hover:underline">
               عرض كل {post.stats.comments} تعليق
             </button>
          </div>
        </article>
      ))}

      <div className="text-center py-6">
        <button className="bg-gray-100 text-gray-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
           تحميل المزيد
        </button>
      </div>
    </div>
  );
}
