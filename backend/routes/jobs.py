"""
This module contains the routes for the job searching functionality.
"""

from flask import Blueprint, jsonify, request
from models import Users
from utils import get_userid_from_header
from config import config
from fake_useragent import UserAgent
import random

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from fake_useragent import UserAgent
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

jobs_bp = Blueprint("jobs", __name__)


from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from fake_useragent import UserAgent

def scrape_careerbuilder_jobs(keywords: str, company: str, location: str):
    # Generate a random User-Agent to evade bot detection
    ua = UserAgent()
    user_agent = ua.random

    # Set up Selenium with headless Chrome
    options = Options()
    options.add_argument("--headless")  # Run headless mode
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument(f"user-agent={user_agent}")  # Fake User-Agent

    results = []

    print("Starting Chrome WebDriver...")
    with webdriver.Remote(config["SELENIUM_URL"] + "/wd/hub", options=options) as driver:
        wait = WebDriverWait(driver, 5)
        print("Chrome WebDriver started.")

        url = f"https://www.careerbuilder.com/jobs?company_request=false&company_name=&company_id=&keywords={keywords}+{company}&location={location.replace(' ', '+')}"
        print(f"URL: {url}")

        driver.get(url)

        print("Retrieving job listings...")
        job_listings = wait.until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "li.data-results-content-parent"))
        )

        print(f"Found {len(job_listings)} jobs.")

        for job in job_listings:
            try:
                title = job.find_element(By.CSS_SELECTOR, "div.data-results-title").text.strip()
                
                # Extract company, location, job type safely
                details = job.find_element(By.CSS_SELECTOR, "div.data-details")
                spans = details.find_elements(By.TAG_NAME, "span")
                
                company_name = spans[0].text.strip() if len(spans) > 0 else "N/A"
                job_location = spans[1].text.strip() if len(spans) > 1 else "N/A"
                job_type = spans[2].text.strip() if len(spans) > 2 else "N/A"

                # Extract job link
                link_element = job.find_element(By.CSS_SELECTOR, "a.data-results-content")
                job_link = link_element.get_attribute("href")

                # Extract job ID from URL
                job_id = job_link.split("/")[-1]

                # Append result
                results.append({
                    "title": title,
                    "company": company_name,
                    "location": job_location,
                    "type": job_type,
                    "link": job_link,
                    "id": job_id
                })

            except Exception as e:
                print(f"Error scraping job: {e}")

        return results



@jobs_bp.route("/search", methods=["GET"])
def search():
    """
    Searches the web and returns the job postings for the given search filters

    :return: JSON object with job results
    """
    try:
        keywords = request.args.get("keywords")
        company = request.args.get("company")
        location = request.args.get("location")

        return scrape_careerbuilder_jobs(keywords, company, location)
    
    except Exception as err:
        print(f"THIS IS THE ERROR: {err}")
        return jsonify({"error": "Internal server error"}), 500
    

@jobs_bp.route("/getRecommendations", methods=["GET"])
def getRecommendations():
    """
    Scrapes jobs based on user's skills, job levels, and locations
    
    :return: JSON object with job results
    """
    try:
        userid = get_userid_from_header()
        user = Users.objects(id=userid).first()

        skill_sets = [x["value"] for x in user["skills"]]
        job_levels_sets = [x["value"] for x in user["job_levels"]]
        locations_set = [x["value"] for x in user["locations"]]
        
        if not skill_sets or not locations_set:
            return jsonify({"error": "No skills and/or locations found"}), 400
        
        keywords = random.choice(skill_sets) + ' ' + (random.choice(job_levels_sets) if len(job_levels_sets) > 0 else '')
        location = random.choice(locations_set)
        
        return scrape_careerbuilder_jobs(keywords, '', location)

    except Exception as err:
        print(err)
        return jsonify({"error": "Internal server error"}), 500
