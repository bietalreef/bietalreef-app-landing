import React from 'react';
import { Link } from 'react-router-dom';
import { EMIRATES_AND_CITIES, AI_TOOLS_LINKS, PRIORITY_SERVICES, generateServiceUrl, generateToolUrl } from '../../utils/seoConstants';

export const FooterDirectory = () => {
  return (
    <div className="bg-gray-50 border-t border-gray-200 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* قسم الأدوات الذكية - الأولوية القصوى */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            أدوات بيت الريف الذكية
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {AI_TOOLS_LINKS.map((tool) => (
              <Link 
                key={tool.slug} 
                to={generateToolUrl(tool.slug)}
                className="group p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col"
              >
                <span className="font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                  {tool.nameAr}
                </span>
                <span className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {tool.description}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* شبكة المناطق والخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {EMIRATES_AND_CITIES.map((city) => (
            <div key={city.slug} className="flex flex-col">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">
                خدمات في {city.nameAr}
              </h4>
              <ul className="space-y-2">
                {PRIORITY_SERVICES.slice(0, 5).map((service) => (
                  <li key={`${city.slug}-${service.slug}`}>
                    <Link 
                      to={generateServiceUrl(service.slug, city.slug)}
                      className="text-gray-500 hover:text-green-600 text-xs transition-colors block py-0.5"
                    >
                      {service.nameAr} في {city.nameAr}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    to={`/ae/${city.slug}`} 
                    className="text-green-700 hover:text-green-800 text-xs font-medium mt-1 inline-block"
                  >
                    عرض كل خدمات {city.nameAr} &larr;
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* التذييل القانوني للروابط */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            تغطي خدمات بيت الريف جميع إمارات الدولة: العين، أبوظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة.
          </p>
        </div>
      </div>
    </div>
  );
};
