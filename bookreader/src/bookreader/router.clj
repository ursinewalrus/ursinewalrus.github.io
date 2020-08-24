(ns bookreader.router
  (:require [ring.middleware.defaults :refer [wrap-defaults site-defaults api-defaults]]
            [ring.util.response :as resp]
            [compojure.core :refer [ANY GET POST defroutes]]
            [hiccup.page :as h]
            [clojure.java.io :as io]
))


#_(defn wrap-dir-index [handler]
  (fn [req]
    (handler
     (update-in req [:uri]
                #(if (= "/books" %) "/index.html" %)))))

(defn get-book-list
  []
  (->>
   (io/file "resources/public/Books/")
   (io/.listFiles)
   (map #(io/.getName %))
   (clojure.string/join ":$:")
))

(defn app-wrapper
  [page-type]
  {
   :status 200
   :headers {"Content-Type" "text/html; charset=utf-8"}
   :body
   (h/html5
    [:html 
     [:div {:id "app-wrapper"} 
      (if (= page-type "reader")
        [:div {:id "book-list" :data-book-list (get-book-list)}]
        )
      [:div {:id page-type}
       (h/include-js "js/compiled/bookreader.js")
       (h/include-css "css/scss_outputs/theme.css")]]
])})

(defroutes routes
  (GET "/books" _ (app-wrapper "books"))
  (GET "/reader" _ (app-wrapper "reader"))
)


(def http-handler
  (-> routes
      (wrap-defaults api-defaults)))


