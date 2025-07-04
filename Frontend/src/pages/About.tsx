import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PageTransition from '@/components/PageTransition';
import { useNavigate } from "react-router-dom";
import { link } from "fs";

const About = () => {
  const navigate =useNavigate()
  const teamMembers = [
    {
      name: "Yaafay",
      role: "Software Engineering Student",
      description: "A dedicated student at NED University, passionate about building innovative software solutions.",
      imageUrl: "https://avatars.githubusercontent.com/u/171413624?v=4",
      href:"https://github.com/MuhammadYaafay" // You can add actual image URLs when available
    },
    {
      name: "Khadija",
      role: "Software Engineering Student",
      description: "An aspiring software engineer at NED University with a keen interest in technology.",
      imageUrl: "https://avatars.githubusercontent.com/u/145339036?v=4",
      href:"https://github.com/kkJawaid" 
    },
    {
      name: "Adil",
      role: "Software Engineering Student",
      description: "A driven student at NED University focused on developing user-centric applications.",
      imageUrl: "https://avatars.githubusercontent.com/u/145782640?v=4",
      href:"https://github.com/adil-java"
    },
    {
      name: "Sufia",
      role: "Software Engineering Student",
      description: "A talented software engineering student at NED University with a passion for problem-solving.",
      imageUrl: null,
      href:"https://github.com/sufia5125" 
    }
  ];

  return (
    <PageTransition>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About Our Team</h1>
            <p className="text-lg text-muted-foreground">
              Meet the talented students behind NED Events, all pursuing Software Engineering at NED University.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <Card onClick={() => window.open(member.href, '_blank')} key={index}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {member.imageUrl ? (
                      <AvatarImage src={member.imageUrl} alt={member.name} />
                    ) : (
                      <AvatarFallback className="text-lg">{member.name[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;