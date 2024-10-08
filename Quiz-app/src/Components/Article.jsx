import { useParams } from "react-router";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import BoldText from "./BoldText";
import { Link } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

const Article = ({ url }) => {
  const { category } = useParams();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState({ beginners: [], intermediate: [], advanced: [] });
  const [currentSection, setCurrentSection] = useState('');

  const beginnersRef = useRef(null);
  const intermediateRef = useRef(null); 
  const advancedRef = useRef(null);

 

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${url}/api/articles/listFilArticle?category2=${category}`);
        const groupedArticles = { beginners: [], intermediate: [], advanced: [] };

        response.data.data.forEach((article) => {
          if (groupedArticles[article.category1]) {
            groupedArticles[article.category1].push(article);
          }
        });

        setArticles(groupedArticles);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the articles!', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the element is in view
    );

    if (beginnersRef.current) observer.observe(beginnersRef.current);
    if (intermediateRef.current) observer.observe(intermediateRef.current);
    if (advancedRef.current) observer.observe(advancedRef.current);

    return () => {
      if (beginnersRef.current) observer.unobserve(beginnersRef.current);
      if (intermediateRef.current) observer.unobserve(intermediateRef.current);
      if (advancedRef.current) observer.unobserve(advancedRef.current);
    };
  }, []);

  const renderArticlesByCategory = (categoryTitle, articles, ref) => (
    <>
      {articles.length > 0 && (
        <div ref={ref} id={categoryTitle.toLowerCase()} className=" bg-gray-100 my-8 rounded-2xl ">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-black uppercase pt-6 underline underline-offset-4 pl-3">{categoryTitle} level</h2>
          {articles.map((article) => (
            <div key={article._id} className="w-full  p-3 sm:p-6 ">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-4">{article.Question}</h3>
              <BoldText text={article.text1} className=" my-4"/>
              <div className="my-4">
              </div>
              {article.image && (
                <img
                  src={`${article.image}`}
                  alt="Article Visual"
                  className="object-contain mx-auto mb-4 rounded-lg"
                />
              )}
              
              <BoldText text={article.text2} className=" my-4 "/>
              {article.liText && (
                <ol className="list-disc list-outside mb-4 ml-4">
                  {article.liText.map((li, index) => (
                    <li key={index} className="text-gray-700 my-2"><BoldText text={li}></BoldText></li>
                  ))}
                </ol>
              )}
              <BoldText text={article.text3} className=" my-4 "/>
              </div>
          ))}
        </div>
      )}
    </>
  );

  const scrollToCategory = (categoryId) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setCurrentSection(categoryId); // Manually set the current section
    }
  };

  return (
  <>
  <div className="table mx-auto my-4">
        <Link
          to="/articles"
          className="flex items-center gap-1 justify-center w-fit cursor-pointer text-gray-600 hover:underline underline-offset-2 "
        >
          <IoArrowBackOutline className="size-5" />
          <span className="font-semibold">Go back to Articles Home page</span>
        </Link>
      </div>
    <div className="lg:grid grid-cols-1 md:grid-cols-3  p-6">
      <div className="md:col-span-2 flex justify-center lg:justify-end items-center">
        <div className="sm:w-2/3">
          {renderArticlesByCategory(
            "Beginners",
            articles.beginners,
            beginnersRef
          )}
          {renderArticlesByCategory(
            "Intermediate",
            articles.intermediate,
            intermediateRef
          )}
          {renderArticlesByCategory("Advanced", articles.advanced, advancedRef)}
        </div>
      </div>
      <div className="hidden w-full sm:table text-center">
        <div className="sticky top-20">
          <div className="flex flex-col space-y-2">
            <h2 className="text-2xl font-bold">List of Categories</h2>
            <button
              onClick={() => scrollToCategory("beginners")}
              className={`hover:underline ${
                currentSection === "beginners"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Beginners Level
            </button>
            <button
              onClick={() => scrollToCategory("intermediate")}
              className={`hover:underline ${
                currentSection === "intermediate"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Intermediate Level
            </button>
            <button
              onClick={() => scrollToCategory("advanced")}
              className={`hover:underline ${
                currentSection === "advanced"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Advanced Level
            </button>
          </div>
        </div>
      </div>
    </div>
  </>

  );
};

export default Article;
