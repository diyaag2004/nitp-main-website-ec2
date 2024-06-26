import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import mail from "./img/mail.svg";
import Layout from "../layout";
import { FacultyProfile } from "../styles/facultyprofile";

const Facultyprofile = ({ url }) => {
  const [data, setData] = useState({
    profile: {},
    publications: [],
    subjects: [],
    memberships: [],
    qualification: [],
    pg_ug: [],
    currResponsibility: [],
    pastResponsibility: [],
    patents: [],
    books: [],
    journals: [],
    conferences: [],
    articles: [],
    projects: [],
    services: [],
    workExperience: [],
    phdCandidates: []
  });
// Helper function to format each article
function formatArticle(article) {
 
  return `${article.authors}, "${article.title}," ${article.journal_name}, (${article.year})`;
}
// Helper function to format each conference
function formatConference(conference) {
  return `${conference.authors}, "${conference.title}," ${conference.year}, ${conference.booktitle}`;
}
  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(url);
      const detail = res.data;
      console.log("API Response:", detail);

      // Function to sort items by year descending
      const sortByYearDesc = (arr, key = "year") => {
        return arr.sort((a, b) => new Date(b[key]) - new Date(a[key]));
      };

      setData({
        profile: detail.profile || {},
        publications: detail.publications ? JSON.parse(detail.publications[0].publications) : [],
        subjects: detail.subjects_teaching || [],
        memberships: detail.memberships || [],
        qualification: detail.education || [],
        pg_ug: detail.pg_ug_projects || [],
        currResponsibility: detail.curr_admin_responsibility || [],
        pastResponsibility: detail.past_admin_responsibility || [],
        patents: detail.publications && detail.publications[0]?.publications
          ? sortByYearDesc(JSON.parse(detail.publications[0].publications).filter(x => x.type === "patent"))
          : [],
        books: detail.publications && detail.publications[0]?.publications
          ? sortByYearDesc(JSON.parse(detail.publications[0].publications).filter(x => x.type === "book"))
          : [],
        journals: detail.journals ? sortByYearDesc(detail.journals) : [],
        conferences: detail.publications && detail.publications[0]?.publications
          ? sortByYearDesc(JSON.parse(detail.publications[0].publications).filter(x => x.type === "conference"))
          : [],
        articles: detail.publications && detail.publications[0]?.publications
          ? sortByYearDesc(JSON.parse(detail.publications[0].publications).filter(x => x.type === "article"))
          : [],
        publications: detail.publications && detail.publications[0]?.publications
        ? sortByYearDesc(JSON.parse(detail.publications[0].publications).filter(x => x.type === "publication"))
        : [],
        projects: detail.project ? sortByYearDesc(detail.project, "start") : [],
        services: detail.professional_service || [],
        workExperience: detail.work_experience || [],
        phdCandidates: detail.phd_candidates ? sortByYearDesc(detail.phd_candidates, "completion_year") : []
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleScroll = () => {
      let scrolled = document.scrollingElement.scrollTop;
      if (scrolled >= 120) {
        if (window.innerWidth > 768) {
          const imgRow = document.querySelector(".faculty-img-row");
          if (imgRow) {
            imgRow.style.marginTop = "-4vh";
          }
        }
      } else {
        const imgRow = document.querySelector(".faculty-img-row");
        if (imgRow) {
          imgRow.style.marginTop = "3vh";
        }
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Layout department={data.profile.department}>
      <FacultyProfile className="row">
        <div className="faculty-img-row">
          <div className="faculty-img-wrap">
            <img
              src={data.profile.image || "/faculty.png"}
              className="facultypic"
              alt="Faculty"
            />
          </div>
          <a href={`mailto:${data.profile.email}`} target="_blank" rel="noopener noreferrer">
            <img src={mail} className="img-fluid facmail" alt="Email" />
          </a>
          <h2>{data.profile.name}</h2>
          <h3>{data.profile.designation}</h3>

          {data.profile.cv && (
            <div>
              <a href="#cv">
                <button className="cv-btn" color="primary" variant="contained">
                  View CV
                </button>
              </a>
            </div>
          )}

          {/* Render button for Publications if available */}
          {data.publications.length > 0 && data.publications[0].pub_pdf && (
            <div>
              <a href="#pub_pdf">
                <button className="cv-btn" color="primary" variant="contained">
                  View Publications
                </button>
              </a>
            </div>
          )}

          {/* Render Personal Webpage link if available */}
          {data.profile.personal_webpage && (
            <div style={{ margin: "3px" }}>
              <a href={data.profile.personal_webpage}>
                <button className="cv-btn" color="primary" variant="contained">
                  Personal Webpage
                </button>
              </a>
            </div>
          )}

          {/* Social Media Links */}
          <div className="link-card">
            {data.profile.linkedin && (
              <span className="link-icon">
                <a href={data.profile.linkedin}>
                  <img src={"/linkedin.svg"} alt="Linkedin" />
                </a>
              </span>
            )}
            {data.profile.google_scholar && (
              <span className="link-icon">
                <a href={data.profile.google_scholar}>
                  <img src={"/googleScholar.svg"} alt="Google Scholar" />
                </a>
              </span>
            )}
            {data.profile.scopus && (
              <span>
                <a href={data.profile.scopus}>
                  <img src={"/scopus.svg"} alt="Scopus" />
                </a>
              </span>
            )}
            {data.profile.vidwan && (
              <span>
                <a href={data.profile.vidwan}>
                  <img src={"/vidwan.svg"} alt="Vidwan" />
                </a>
              </span>
            )}
            {data.profile.orcid && (
              <span>
                <a href={data.profile.orcid}>
                  <img src={"/orcid.svg"} alt="Orcid" />
                </a>
              </span>
            )}
          </div>
        </div>

        {/* Render CV Popup if available */}
        {data.profile.cv && (
          <div id="cv" className="cv">
            <a href="#" className="close">
              <div className="popup">
                <div className="close">X</div>
                <div className="content">
                  <iframe
                    src={`https://drive.google.com/file/d/${data.profile.cv.split("id=").pop()}/preview`}
                    width="100%"
                    height="100%"
                    title="CV"
                  />
                </div>
              </div>
            </a>
          </div>
        )}

        {/* Render Publications PDF Preview if available */}
        {data.publications.length > 0 && data.publications[0].pub_pdf && (
          <div id="pub_pdf" className="cv">
            <a href="#" className="close">
              <div className="popup">
                <div className="close">X</div>
                <div className="content">
                  <iframe
                    src={`${data.publications[0].pub_pdf.split("view")[0]}/preview?usp=drivesdk`}
                    width="100%"
                    height="100%"
                    title="Publications"
                  />
                </div>
              </div>
            </a>
          </div>
        )}

        {/* Faculty Details */}
        <div className="faculty-details-row">
          <h1>Profile</h1>

          {/* Render Research Interests */}
          <div className="fac-card" data-aos="fade-up">
            <h3>Research Interests</h3>
            <p>{data.profile.research_interest}</p>
          </div>

          {/* Render Contact Information */}
          <div className="fac-card" data-aos="fade-up">
            <h3>Contact Information</h3>
            <div className="row">
              <div className="col-6">
                <p><strong>Email:</strong> {data.profile.email}</p>
              </div>
              <div className="col-6">
                <p><strong>Phone:</strong> {data.profile.ext_no}</p>
              </div>
            </div>
          </div>
          {/* Render Work Experience if available */}
          {data.workExperience.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Work Experience</h3>
              <div className="factable">
                <table>
                  {data.workExperience.map((exp, index) => (
                    <tr key={index}>
                      <td>{exp.work_experiences}</td>
                      <td>{exp.institute}</td>
                      <td>{exp.start} - {exp.end}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          )}
          {/* Render Education if available */}
         {data.qualification.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Education</h3>
              <div className="factable">
                <table>
                  {data.qualification.map((edu, index) => (
                    <tr key={index}>
                      <td>{edu.certification}</td>
                      <td>{edu.institution}</td>
                      <td>{edu.passing_year}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          )}
          {/* Render Subjects Taught if available */}
          {data.subjects.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Subjects Taught</h3>
              <div className="factable">
                <table>
                  <tbody>
                    {data.subjects.map((subject, index) => (
                      <tr key={index}>
                        <td>{subject.code}</td>
                        <td>{subject.name}</td>
                        <td>{subject.start} - {subject.end}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
 {/* Render Projects if available */}
 {data.projects.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Projects</h3>
              <div className="factable">
                <table>
                  {data.projects.map((project, index) => (
                    <tr key={index}>
                      <td>{project.project}</td>
                      <td>{project.sponsor}</td>
                      <td>{project.amount}</td>
                      <td>{project.start} - {project.end}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          )}


         


           {/* Render Patents if available */}
           {data.patents.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Patents</h3>
              <div className="factable">
                <table>
                  {data.patents.map((patent, index) => (
                    <tr key={index}>
                      <td>{patent.title}</td>
                      <td>{patent.citation_key}</td>
                      <td>{patent.year}</td>
                      <td>{patent.authors}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          )}
                    {/* Render Publications if available */}
                    {data.publications.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Publications</h3>
              <div className="factable">
                <table>
                  <tbody>
                    {data.publications.map((publication, index) => (
                      <tr key={index}>
                        <td>{publication.title}</td>
                        <td>{publication.authors}</td>
                        <td>{publication.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Render Journals if available */}
          {data.journals.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Journals</h3>
              <div className="factable">
                <table>
                  <tbody>
                    {data.journals.map((journal, index) => (
                      <tr key={index}>
                        <td>{journal.journal_name}</td>
                        <td>{journal.volume}</td>
                        <td>{journal.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
{/* Render Articles if available */}
{data.articles.length > 0 && (
  <div className="fac-card" data-aos="fade-up">
    <h3>Articles</h3>
    <div className="factable">
      {data.articles.map((article, index) => (
        <div key={index} className="article">
          <ul>
            <li><p>{formatArticle(article)}</p></li>
          </ul>
          
        </div>
      ))}
    </div>
  </div>
)}


          {/* Render Books if available */}
          {data.books.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Books</h3>
              <div className="factable">
                <table>
                  {data.books.map((book, index) => (
                    <tr key={index}>
                      <td>{book.title}</td>
                      <td>{book.year}</td>
                      <td>{book.authors}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          )}


          {/* Render Conferences if available */}
{data.conferences.length > 0 && (
  <div className="fac-card" data-aos="fade-up">
    <h3>Conferences</h3>
    <div className="factable">
      
        {data.conferences.map((conference, index) => (
        <div key={index} className="article">
          <ul>
            <li><p>{formatConference(conference)}</p></li>
          </ul>
          
        </div>
      ))}
          
        
      
    </div>
  </div>
)}

                   {/* Render Memberships if available */}
                   {data.memberships.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Memberships</h3>
              <div className="factable">
                <table>
                  <tbody>
                    {data.memberships.map((membership, index) => (
                      <tr key={index}>
                        <td>{membership.membership_society}</td>
                        <td>{membership.start} - {membership.end}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
         
          {/* Render Professional Services if available */}
          {data.services.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Professional Services</h3>
              <div className="factable">
              <table>
              {data.services.map((service, index) => {
            
            const match = service.services.match(/(\d{4})\s*-\s*(Present|\d{4})/);
            const yearRange = match ? `${match[1]} - ${match[2]}` : '---';

            return (
              <tr key={index}>
                <td>{service.services}</td>
                <td>{yearRange}</td>
              </tr>
            );
          })}
                </table>
              </div>
              
            </div>
          )}
          {/* Render Current Administrative Responsibilities if available */}
          {data.currResponsibility.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Current Administrative Responsibilities</h3>
              <ul>
                {data.currResponsibility.map((responsibility, index) => (
                  <li key={index}>{responsibility.curr_responsibility}</li>
                ))}
              </ul>
            </div>
          )}

          
          {/* Render Past Administrative Responsibilities if available */}
          {data.pastResponsibility.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Past Administrative Responsibilities</h3>
              <ul>
                {data.pastResponsibility.map((responsibility, index) => (
                  <li key={index}>{responsibility.past_responsibility}</li>
                ))}
              </ul>
            </div>
          )}




          
 


           


           {/* Render Ph.D. Candidates if available */}
           {data.phdCandidates.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Ph.D. Candidates</h3>
              <div className="factable">
                <table>
                  {data.phdCandidates.map((candidate, index) => (
                    <tr key={index}>
                      <td>{candidate.phd_student_name}</td>
                      <td>{candidate.thesis_topic}</td>
                      <td>{candidate.start_year} - {candidate.completion_year}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          )}
{/* Render PG/UG Projects Supervised if available */}
{data.pg_ug.length > 0 && (
            <div className="fac-card" data-aos="fade-up">
              <h3>PG/UG Projects Supervised</h3>
              <div className="factable">
                <table>
                  {data.pg_ug.map((project, index) => (
                    <tr key={index}>
                      <td>{project.student_name}</td>
                      <td>{project.student_program}</td>
                      <td>{project.project_topic}</td>
                      <td>{project.start_year} - {project.completion_year}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          )}
 {/* Render Publications PDF Preview if available */}
 {data.publications.length > 0 && data.publications[0].pub_pdf && (
            <div className="fac-card" data-aos="fade-up">
              <h3>Publications PDF Preview</h3>
              <div className="factable">
                <iframe
                  src={`${data.publications[0].pub_pdf.split("view")[0]}/preview?usp=drivesdk`}
                  width="100%"
                  height="600px"
                  title="Publications Preview"
                />
              </div>
            </div>
          )}
        </div>
      </FacultyProfile>
    </Layout>
  );
};

export default Facultyprofile;
