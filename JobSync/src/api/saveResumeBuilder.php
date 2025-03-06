<?php
include 'dbconnect.php';
include 'config.php';  

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()])); 
}

$data = json_decode(file_get_contents("php://input"), true);

    try {
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->beginTransaction();  

        $applicant_id = $data['applicant_id'] ?? null;   
        $firstname = $data['firstname']?? null;  
        $lastname = $data['lastname'] ?? null;
        $contact = $data['contact'] ?? null;
        $email = $data['email'] ?? null;
        $birthdate = $data['birthdate'] ?? null;
        $address = $data['address'] ?? null;
        $city = $data['city'] ?? null;
        $postal = $data['postal'] ?? null;
        $nationality = $data['nationality'] ?? null;
        $education = $data['education'] ?? null;
        $program = $data['program'] ?? null;
        $profileSummary = $data['profileSummary'] ?? null;
        $country = $data['country'] ?? null;
        $company_name = $data['company_name'] ?? null;
        $job_title = $data['job_title'] ?? null;
        $prevcity = $data['prevcity'] ?? null;
        $description = $data['description'] ?? null;
        $profile_picture = $data['profile_picture'] ?? null;

        $query = "SELECT builder_id FROM js_resume_builder WHERE applicant_id = :applicant_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":applicant_id", $applicant_id, PDO::PARAM_INT);
        $stmt->execute();
        $existingResume = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($profile_picture) {
            if (preg_match('/^data:image\/\w+;base64,/', $profile_picture) || preg_match('/^[A-Za-z0-9+\/=]+$/', $profile_picture)) {
                $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $profile_picture);
                $decodedImage = base64_decode($imageData);
                if ($decodedImage === false) {
                    die("Error: Invalid Base64 encoding.");
                }
                $imagePath = "uploads/profile_" . $applicant_id . ".png";
                $saveResult = file_put_contents($imagePath, $decodedImage);
                if ($saveResult === false) {
                    die("Error: Failed to save image.");
                }
                $profile_picture = $imagePath;
            } 
        } else {
            $query = "SELECT profile_picture FROM js_resume_builder WHERE applicant_id = :applicant_id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(":applicant_id", $applicant_id, PDO::PARAM_INT);
            $stmt->execute();
            $existingProfile = $stmt->fetch(PDO::FETCH_ASSOC);
            $profile_picture = $existingProfile['profile_picture'] ?? null;
        }

        if ($existingResume) {
            $builder_id = $existingResume['builder_id'];
            $updateQuery = "UPDATE js_resume_builder SET 
            firstname=:firstname, lastname=:lastname, contact=:contact, email=:email, birthdate=:birthdate, 
            address=:address, city=:city, postal=:postal, nationality=:nationality, education=:education, 
            program=:program, profileSummary=:profileSummary, country=:country, profile_picture=:profile_picture
            WHERE applicant_id=:applicant_id";
        
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->execute([
                ":firstname" => $firstname,
                ":lastname" => $lastname,
                ":contact" => $contact,
                ":email" => $email,
                ":birthdate" => $birthdate,
                ":address" => $address,
                ":city" => $city,
                ":postal" => $postal,
                ":nationality" => $nationality,
                ":education" => $education,
                ":program" => $program,
                ":profileSummary" => $profileSummary,
                ":country" => $country,
                ":profile_picture" => $profile_picture,
                ":applicant_id" => $applicant_id
            ]);
        } else {
            // Insert new resume
            $insertQuery = "INSERT INTO js_resume_builder (applicant_id, firstname, lastname, contact, email, birthdate, 
                            address, city, postal, nationality, education, program, profileSummary, country, profile_picture) 
                            VALUES (:applicant_id, :firstname, :lastname, :contact, :email, :birthdate, 
                            :address, :city, :postal, :nationality, :education, :program, :profileSummary, :country, :profile_picture)";
            
            $insertStmt = $conn->prepare($insertQuery);
            $insertStmt->execute([
                ":applicant_id" => $applicant_id,
                ":firstname" => $firstname,
                ":lastname" => $lastname,
                ":contact" => $contact,
                ":email" => $email,
                ":birthdate" => $birthdate,
                ":address" => $address,
                ":city" => $city,
                ":postal" => $postal,
                ":nationality" => $nationality,
                ":education" => $education,
                ":program" => $program,
                ":profileSummary" => $profileSummary,
                ":country" => $country,
                ":profile_picture" => $profile_picture,
            ]);

            $builder_id = $conn->lastInsertId(); 
        }

        if (!empty($data['workExperiences'])) {
            $deleteWorkExpQuery = "DELETE FROM js_resume_work_experience WHERE builder_id = :builder_id";
            $deleteWorkExpStmt = $conn->prepare($deleteWorkExpQuery);
            $deleteWorkExpStmt->execute([":builder_id" => $builder_id]);

            $insertWorkExpQuery = "INSERT INTO js_resume_work_experience (builder_id, company_name, job_title, prevcity, description) 
                                   VALUES (:builder_id, :company_name, :job_title, :prevcity, :description)";
            $insertWorkExpStmt = $conn->prepare($insertWorkExpQuery);

            foreach ($data['workExperiences'] as $work) {
                $insertWorkExpStmt->execute([
                    ":builder_id" => $builder_id,
                    ":company_name" => $work['company_name'],
                    ":job_title" => $work['job_title'],
                    ":prevcity" => $work['prevcity'],
                    ":description" => $work['description']
                ]);
            }
        }

        if (!empty($data['skills'])) {
            $deleteSkillsQuery = "DELETE FROM js_resume_skills WHERE builder_id = :builder_id";
            $deleteSkillsStmt = $conn->prepare($deleteSkillsQuery);
            $deleteSkillsStmt->execute([":builder_id" => $builder_id]);

            $insertSkillQuery = "INSERT INTO js_resume_skills (builder_id, skill_name) VALUES (:builder_id, :skill_name)";
            $insertSkillStmt = $conn->prepare($insertSkillQuery);

            foreach ($data['skills'] as $skill) {
                $insertSkillStmt->execute([
                    ":builder_id" => $builder_id,
                    ":skill_name" => $skill
                ]);
            }
        }

        $conn->commit();  

        echo json_encode(["success" => true, "message" => "Resume saved successfully"]);
    } catch (PDOException $e) {
        $conn->rollBack(); 
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }

?>
