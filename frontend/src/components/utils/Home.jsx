import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  Fade,
  Tooltip,
  Avatar,
  Chip,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Search,
  Work,
  Business,
  Code,
  DesignServices,
  GitHub,
  LinkedIn,
  Twitter,
  LocationOn,
  AttachMoney,
  Schedule,
  Star,
  ArrowForward,
  Menu,
  Close,
} from "@mui/icons-material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from "react-router-dom";

const companies = [
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Microsoft",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBLoZC_9b_6CZT9WsMYzHZ7jFf8oeucvuUMA&s",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
  {
    name: "Paytm",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png",
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  },
];

const colors = {
  primary: "#4F46E5",
  secondary: "#10B981",
  dark: "#1F2937",
  light: "#F9FAFB",
  text: "#374151",
  accent: "#F59E0B",
};


function RotatingQuote() {
  const quotes = [
    "Your next role is just a click away",
    "Connecting talent with opportunity",
    "Launch Your Career Today",
    "We Bring Jobs to People, Not Just People to Jobs",
  ];

  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length);
        setShow(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Fade in={show} timeout={500}>
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          color: colors.text,
          fontWeight: 400,
          maxWidth: "600px",
          mx: "auto",
          lineHeight: 1.6,
        }}
      >
        {quotes[index]}
      </Typography>
    </Fade>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <Box
        sx={{
          position: "fixed",
          width: "100%",
          bgcolor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          py: 2,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: colors.primary,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 10,
                height: 10,
                bgcolor: colors.secondary,
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            JobHive
          </Typography>

          {isMobile ? (
            <IconButton onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <Close /> : <Menu />}
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 4 }}>
              <Button color="inherit">Home</Button>
              <Button color="inherit">Jobs</Button>
              <Button color="inherit">Companies</Button>
              <Button color="inherit">Resources</Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: colors.primary,
                  "&:hover": { bgcolor: "#4338CA" },
                }}
              >
                Post a Job
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Mobile Menu */}
      {mobileOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 70,
            left: 0,
            right: 0,
            bgcolor: "white",
            zIndex: 999,
            boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
            py: 2,
            px: 3,
          }}
        >
          <Button fullWidth sx={{ justifyContent: "flex-start", mb: 1 }}>
            Home
          </Button>
          <Button fullWidth sx={{ justifyContent: "flex-start", mb: 1 }}>
            Jobs
          </Button>
          <Button fullWidth sx={{ justifyContent: "flex-start", mb: 1 }}>
            Companies
          </Button>
          <Button fullWidth sx={{ justifyContent: "flex-start", mb: 1 }}>
            Resources
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: colors.primary,
              "&:hover": { bgcolor: "#4338CA" },
            }}
          >
            Post a Job
          </Button>
        </Box>
      )}

      {/* Hero Section */}
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 64px)",
          background: `linear-gradient(135deg, #E0F2FE 0%, #FFFFFF 100%)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={6}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: colors.dark,
                    lineHeight: 1.2,
                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  Let Great{" "}
                  <Box component="span" sx={{ color: colors.primary }}>
                    Companies
                  </Box>{" "}
                  Find you
                </Typography>

                <Box sx={{ textAlign: "center" }}>
                  <RotatingQuote />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 4,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => navigate("/jobs")}
                    size="large"
                    sx={{
                      bgcolor: colors.primary,
                      "&:hover": { bgcolor: "#4338CA" },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Browse Jobs
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/login")}
                    size="large"
                    sx={{
                      borderColor: colors.dark,
                      color: colors.dark,
                      px: 4,
                      py: 1.5,
                      "&:hover": { borderColor: colors.dark },
                    }}
                  >
                    How It Works
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    mt: 4,
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: colors.primary }}
                    >
                      50K+
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text }}>
                      Jobs Posted
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: colors.primary }}
                    >
                      10K+
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text }}>
                      Companies
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: colors.primary }}
                    >
                      1M+
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text }}>
                      Candidates
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trusted Companies */}
      <Box
        sx={{
          background: `linear-gradient(135deg, #E0F2FE 0%, #FFFFFF 100%)`,
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: colors.text,
              mb: 3,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            <b>Trusted by leading companies</b>
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              paddingTop:"20px",
              gap: 4,
            }}
          >
            {companies.map((company, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "4px 8px",
                }}
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  style={{
                    height: "32px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: colors.text,
                    opacity: 0.7,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  {/* {company.name} */}
                </Typography>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Job Categories */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: 600, mx: "auto", mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: colors.dark,
                mb: 2,
              }}
            >
              Explore by Category
            </Typography>
            <Typography variant="body1" sx={{ color: colors.text }}>
              Discover jobs across all industries and find the perfect fit for
              your skills and experience
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { title: "Technology", icon: <Code />, jobs: "1,240" },
              { title: "Finance", icon: <AttachMoney />, jobs: "890" },
              { title: "Design", icon: <DesignServices />, jobs: "650" },
              { title: "Marketing", icon: <Business />, jobs: "1,120" },
              { title: "Healthcare", icon: <Work />, jobs: "980" },
              { title: "Education", icon: <Work />, jobs: "760" },
            ].map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div whileHover={{ y: -5 }}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 1,
                      border: "1px solid #E5E7EB",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: colors.primary,
                        boxShadow: `0 10px 20px ${colors.primary}10`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: `${colors.primary}10`,
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                      }}
                    >
                      {React.cloneElement(category.icon, {
                        sx: { fontSize: 30, color: colors.primary },
                      })}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text }}>
                      {category.jobs} jobs available
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Jobs */}
      <Box sx={{ bgcolor: colors.light, py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 6,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: colors.dark }}
              >
                Featured Jobs
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text }}>
                Curated selection of the most exciting opportunities
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate("/jobs")}
              sx={{
                
                borderColor: colors.primary,
                color: colors.primary,
                "&:hover": { borderColor: colors.primary },
              }}
            >
              View All Jobs
            </Button>
          </Box>
          <Grid container spacing={3}>
            {[
              {
                title: "Senior Product Designer",
                company: "Airbnb",
                location: "San Francisco, CA",
                salary: "$120k - $150k",
                type: "Full Time",
                logo: "/logos/airbnb.png",
                // featured: true,
              },
              {
                title: "Frontend Developer",
                company: "Spotify",
                location: "Remote",
                salary: "$90k - $130k",
                type: "Full Time",
                logo: "/logos/spotify.png",
              },
              {
                title: "Data Scientist",
                company: "Uber",
                location: "New York, NY",
                salary: "$110k - $140k",
                type: "Full Time",
                logo: "/logos/uber.png",
              },
            ].map((job, index) => (
              <Grid item xs={12} key={index}>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <Card
                    sx={{
                      p: 4,
                      borderRadius: 1,
                      border: job.featured
                        ? `2px solid ${colors.accent}`
                        : "1px solid #E5E7EB",
                      boxShadow: "none",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {job.featured && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          bgcolor: colors.accent,
                          color: "white",
                          px: 2,
                          py: 0.5,
                          borderBottomLeftRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Featured
                      </Box>
                    )}
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={2}>
                        <Avatar
                          src={job.logo}
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: colors.light,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          {job.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: colors.text, mb: 1 }}
                        >
                          {job.company} • {job.location}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                          <Chip
                            label={job.type}
                            size="small"
                            sx={{
                              bgcolor: `${colors.primary}10`,
                              color: colors.primary,
                            }}
                          />
                          <Chip
                            label={job.salary}
                            size="small"
                            sx={{
                              bgcolor: `${colors.secondary}10`,
                              color: colors.secondary,
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => navigate("/login")}
                          sx={{
                            bgcolor: colors.primary,
                            "&:hover": { bgcolor: "#4338CA" },
                            px: 4,
                          }}
                        >
                          Apply Now
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ bgcolor: colors.light, py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: 600, mx: "auto", mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: colors.dark,
                mb: 2,
              }}
            >
              Success Stories
            </Typography>
            <Typography variant="body1" sx={{ color: colors.text }}>
              Don't just take our word for it - hear from people who found their
              dream jobs
            </Typography>
          </Box>
          <Carousel
            responsive={{
              desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2 },
              tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
              mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
            }}
            infinite
            autoPlay
            autoPlaySpeed={4000}
            keyBoardControl
            showDots
            arrows={false}
            containerClass="testimonial-carousel"
          >
            {[
              {
                name: "Sarah Johnson",
                role: "Product Designer at Google",
                content:
                  "JobHive helped me find my dream job in just two weeks! The platform is so intuitive and the job matches were spot on.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Software Engineer at Microsoft",
                content:
                  "I was skeptical at first, but after applying to several jobs through JobHive, I landed an offer with a 30% salary increase!",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Marketing Manager at Airbnb",
                content:
                  "The quality of jobs on this platform is unmatched. I recommend JobHive to all my friends looking for career changes.",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <Box key={index} sx={{ p: 2 }}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 1,
                    height: "100%",
                    bgcolor: "white",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  }}
                >
                  <Box sx={{ display: "flex", mb: 3 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ color: colors.accent }} />
                    ))}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.text,
                      mb: 3,
                      fontStyle: "italic",
                      lineHeight: 1.6,
                    }}
                  >
                    "{testimonial.content}"
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        mr: 2,
                        bgcolor: colors.primary,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Carousel>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, #6366F1 100%)`,
          py: 8,
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Ready to find your dream job?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  mb: 3,
                }}
              >
                Join thousands of professionals who found their perfect career
                match with JobHive.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="text"
                  onClick={() => navigate("/signup")}
                  sx={{
                    bgcolor: "white",
                    color: colors.primary,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#F3F4F6" },
                  }}
                >
                  Sign Up Now
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    "&:hover": { borderColor: "#E5E7EB" },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  p: 4,
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  New Jobs This Week
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {[
                    "Senior UX Designer at Netflix",
                    "Frontend Developer at Spotify",
                    "Product Manager at Uber",
                  ].map((job, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 1.5,
                        borderBottom:
                          i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: colors.secondary,
                          borderRadius: "50%",
                          mr: 2,
                        }}
                      />
                      <Typography>{job}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  fullWidth
                  onClick={() => navigate("/jobs")}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    py: 1.5,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                  }}
                >
                  View All New Jobs
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: colors.dark,
          color: "white",
          pt: 8,
          pb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: colors.secondary,
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
                JobHive
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#9CA3AF",
                  mb: 3,
                }}
              >
                The most trusted platform for job seekers and employers to Hive
                and build the future of work.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <IconButton
                  sx={{
                    bgcolor: "#374151",
                    color: "white",
                    "&:hover": { bgcolor: colors.primary },
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: "#374151",
                    color: "white",
                    "&:hover": { bgcolor: "#0A66C2" },
                  }}
                >
                  <LinkedIn />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: "#374151",
                    color: "white",
                    "&:hover": { bgcolor: "#333" },
                  }}
                >
                  <GitHub />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                For Job Seekers
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  "Browse Jobs",
                  "Create Profile",
                  "Job Alerts",
                  "Career Advice",
                ].map((item, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    sx={{
                      color: "#9CA3AF",
                      "&:hover": { color: "white", cursor: "pointer" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                For Employers
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  "Post a Job",
                  "Browse Candidates",
                  "Pricing",
                  "Recruitment Solutions",
                ].map((item, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    sx={{
                      color: "#9CA3AF",
                      "&:hover": { color: "white", cursor: "pointer" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Resources
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {["Blog", "Help Center", "Webinars", "Community"].map(
                  (item, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{
                        color: "#9CA3AF",
                        "&:hover": { color: "white", cursor: "pointer" },
                      }}
                    >
                      {item}
                    </Typography>
                  )
                )}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {["About Us", "Careers", "Contact", "Press"].map((item, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    sx={{
                      color: "#9CA3AF",
                      "&:hover": { color: "white", cursor: "pointer" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: "#374151", my: 6 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
              © {new Date().getFullYear()} JobHive. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#9CA3AF",
                  "&:hover": { color: "white", cursor: "pointer" },
                }}
              >
                Privacy Policy
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#9CA3AF",
                  "&:hover": { color: "white", cursor: "pointer" },
                }}
              >
                Terms of Service
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#9CA3AF",
                  "&:hover": { color: "white", cursor: "pointer" },
                }}
              >
                Cookies
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
