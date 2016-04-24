module Jekyll
  class CategoryList < Liquid::Tag
    def render(context)
      s = StringIO.new
      begin
        categories = context['site']['categories']
        unless categories.nil?
          post_count = context['site']['posts'].size.to_i
          categories.sort_by { |cat, posts| cat }
            .each do |cat, posts|
               s << "<li><a href=\"/categories/#{cat.downcase}\">#{cat} (#{posts.size})</a></li>"
            end
        end
      rescue => boom
        p boom
      end
      "#{s.string}"
    end
  end
end

Liquid::Template.register_tag('category_list', Jekyll::CategoryList) 