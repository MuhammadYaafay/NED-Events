import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PageTransition from '@/components/PageTransition';

const About = () => {
  const teamMembers = [
    {
      name: "Yaafay",
      role: "Software Engineering Student",
      description: "A dedicated student at NED University, passionate about building innovative software solutions.",
      imageUrl: "https://scontent.fkhi16-2.fna.fbcdn.net/v/t39.30808-1/432941960_1914794918923042_2505016485537315150_n.jpg?stp=dst-jpg_s160x160_tt6&_nc_cat=106&ccb=1-7&_nc_sid=e99d92&_nc_ohc=ukufAVHw6ecQ7kNvwGksThe&_nc_oc=AdkfgCKmEJImI3qk6yzkFPH2Qv8j51qa1_GfHl1UcmdF6O2jZQjnH9IcvsVODT-CJqs&_nc_zt=24&_nc_ht=scontent.fkhi16-2.fna&_nc_gid=QxYoEe8ry2BuEGRn2TVi_w&oh=00_AfLzPdst-NfF45wY6_1uXt_4RK71b3YCPnnuR2S9DyORkQ&oe=682597F8" // You can add actual image URLs when available
    },
    {
      name: "Khadija",
      role: "Software Engineering Student",
      description: "An aspiring software engineer at NED University with a keen interest in technology.",
      imageUrl: null
    },
    {
      name: "Adil",
      role: "Software Engineering Student",
      description: "A driven student at NED University focused on developing user-centric applications.",
      imageUrl: "https://scontent.fkhi16-2.fna.fbcdn.net/v/t39.30808-1/434031923_1122688338779699_6858103025138214747_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_ohc=DB141wL8A1YQ7kNvwE5EO9I&_nc_oc=AdnY5m4ONoU80iRX9pPDF4YqMCMwnOatrY8fnRdzJ-cW4q45ZwNuIsd3jq65dd10cRc&_nc_zt=24&_nc_ht=scontent.fkhi16-2.fna&_nc_gid=nSccH9RsPDo_4b3VZZgLWQ&oh=00_AfKDmDxSrYEck_KiHXDPvDRMnpD8lom1V87obdCO5iTkrg&oe=68257AF5"
    },
    {
      name: "Sufia",
      role: "Software Engineering Student",
      description: "A talented software engineering student at NED University with a passion for problem-solving.",
      imageUrl: null
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
              <Card key={index}>
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