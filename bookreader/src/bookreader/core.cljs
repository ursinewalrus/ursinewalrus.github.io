(ns bookreader.core
    (:require 
     [reagent.core :as r]
))

(defonce app-state
  (r/atom {
           :book-list nil
           :book nil
           :page 0
           }))

(defn insert-book-list-into-state
  []
  (let [books
        (-> js/document (.getElementById "book-list") (.getAttribute "data-book-list"))]
    (swap! app-state assoc :book-list (clojure.string/split books ":$:"))
))

(defn reader-page
  []
  [:<> 
   (insert-book-list-into-state)
   [:div {:class "book-list"} 
    (for [book (@app-state :book-list)]
      [:div {:class "book-selector"}
       book
       ])]
   [:div {:class "reader-area"}
    [:img {:src "BookOfTheNewSun/BookOfTheNewSun-2.png"}]
    ]])

(defn render-page
  []
  (r/render-component [reader-page] (js/document.getElementById "reader"));just do for each page
)

(render-page)
